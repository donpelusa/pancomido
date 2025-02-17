// frontend/src/components/admin/EditarUsuarios.jsx
import { useState, useEffect } from "react";
import {
  Collapse,
  Checkbox,
  Button,
  Modal,
  Form,
  Input,
  message,
  Spin,
} from "antd";
import { showUniqueToast } from "../../helpers/showUniqueToast.helper";
import { useAuth } from "../../hooks/useAuth";

export const EditarUsuarios = () => {
  const { session } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar usuarios reales desde la API de administración
  const fetchUsers = async () => {
    if (!session?.token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      showUniqueToast.error(error.message, { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [API_URL, session]);

  // Manejo de selección global
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedIds(users.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectUser = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Eliminar usuarios seleccionados
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    Modal.confirm({
      title: "Eliminar Usuarios",
      content: `¿Seguro que deseas eliminar ${selectedIds.length} usuarios?`,
      okText: "Eliminar",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          // Realizar llamadas concurrentes para eliminar cada usuario
          await Promise.all(
            selectedIds.map((userId) =>
              fetch(`${API_URL}/api/admin/users/${userId}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.token}`,
                },
              })
            )
          );
          showUniqueToast.success("Usuarios eliminados", {
            position: "bottom-right",
          });
          fetchUsers();
          setSelectedIds([]);
          setSelectAll(false);
        } catch (error) {
          showUniqueToast.error(error.message, { position: "bottom-right" });
        }
      },
    });
  };

  // Cambiar rol de los seleccionados (iterando sobre cada usuario)
  const handleChangeRole = async (newRole) => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.all(
        selectedIds.map((userId) =>
          fetch(`${API_URL}/api/admin/users/${userId}/role`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify({ role: newRole }),
          })
        )
      );
      showUniqueToast.success(`Usuarios cambiados a ${newRole}`, {
        position: "bottom-right",
      });
      fetchUsers();
      setSelectedIds([]);
      setSelectAll(false);
    } catch (error) {
      showUniqueToast.error(error.message, { position: "bottom-right" });
    }
  };

  // Abrir modal para editar usuario
  const handleEditUser = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      lastname: user.lastname,
      mail: user.mail,
      phone: user.phone,
      disabled: user.disabled,
    });
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch(`${API_URL}/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar datos del usuario");
      }
      showUniqueToast.success("Datos actualizados", {
        position: "bottom-right",
      });
      setIsModalVisible(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      message.error("Error en el formulario");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingUser(null);
  };

  // Agrupar usuarios:
  // En "Administradores" se incluyen roles "admin" y "developer"
  const admins = users.filter(
    (u) => u.role === "admin" || u.role === "developer"
  );
  // En "Usuarios" se incluyen los que sean "customer"
  const customers = users.filter((u) => u.role === "customer");

  // Preparar items para Collapse usando la nueva API
  const collapseItems = [
    {
      key: "admins",
      label: `Administradores (${admins.length})`,
      children:
        admins.length === 0 ? (
          <p>No hay administradores.</p>
        ) : (
          admins.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border p-2 mb-2"
            >
              <div className="flex items-center">
                <Checkbox
                  onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                  checked={selectedIds.includes(user.id)}
                  className="mr-2"
                />
                <span className="pl-4 pr-4">
                  {user.name} {user.lastname}
                  {user.mail ? ` - ${user.mail}` : ""}
                  {user.phone ? ` - ${user.phone}` : ""}
                  {user.role === "developer" ? (
                    <strong className="ml-2">| Developer</strong>
                  ) : null}
                  {user.disabled ? (
                    <strong className="ml-2">- Deshabilitado</strong>
                  ) : null}
                </span>
              </div>
              <Button type="link" onClick={() => handleEditUser(user)}>
                Editar
              </Button>
            </div>
          ))
        ),
    },
    {
      key: "customers",
      label: `Usuarios (${customers.length})`,
      children:
        customers.length === 0 ? (
          <p>No hay usuarios.</p>
        ) : (
          customers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between border p-2 mb-2"
            >
              <div className="flex items-center">
                <Checkbox
                  onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                  checked={selectedIds.includes(user.id)}
                  className="mr-2"
                />
                <span className="pl-4 pr-4">
                  {user.name} {user.lastname}
                  {user.mail ? ` - ${user.mail}` : ""}
                  {user.phone ? ` - ${user.phone}` : ""}
                  {user.disabled ? (
                    <strong className="ml-2">- Deshabilitado</strong>
                  ) : null}
                </span>
              </div>
              <Button type="link" onClick={() => handleEditUser(user)}>
                Editar
              </Button>
            </div>
          ))
        ),
    },
  ];

  return (
    <div className="p-4">
      {/* Controles globales */}
      <div className="flex items-center gap-4 mb-4">
        <Checkbox onChange={handleSelectAll} checked={selectAll}>
          Seleccionar todo
        </Checkbox>
        <Button type="primary" onClick={handleDeleteSelected}>
          Eliminar Seleccionados
        </Button>
        <Button onClick={() => handleChangeRole("customer")}>
          Cambiar a Usuario
        </Button>
        <Button onClick={() => handleChangeRole("admin")}>
          Cambiar a Admin
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spin tip="Cargando usuarios...">
            <div style={{ width: "350px", height: "150px" }} />
          </Spin>
        </div>
      ) : (
        <Collapse
          items={collapseItems}
          defaultActiveKey={["admins", "customers"]}
        />
      )}

      {/* Modal para editar usuario */}
      <Modal
        title="Edita Datos Usuario"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "El nombre es requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Apellido"
            rules={[{ required: true, message: "El apellido es requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mail"
            label="Email"
            rules={[
              { required: true, message: "El email es requerido" },
              { type: "email", message: "Ingrese un email válido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Teléfono"
            rules={[{ required: true, message: "El teléfono es requerido" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="disabled"
            valuePropName="checked"
            label="Deshabilitado"
          >
            <Checkbox
              disabled={
                editingUser?.role === "admin" && session?.role !== "developer"
              }
            >
              Marcar para deshabilitar
            </Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditarUsuarios;
