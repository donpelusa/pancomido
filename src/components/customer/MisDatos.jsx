// frontend/src/components/customer/MisDatos.jsx

import { useState, useEffect } from "react";
import { Form, Input, Button, Modal, Tooltip, Spin } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { showUniqueToast } from "../../helpers/showUniqueToast.helper";
// Importamos el helper de validación de RUT
import { validaRut } from "../../helpers/validateRut.helper";

export const MisDatos = () => {
  const { session, handleSession } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    lastname: "",
    rut: "",
    phone: "",
    mail: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Función para cargar perfil
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener el perfil");
      const data = await res.json();
      setUserData(data.user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (session?.token) {
      fetchProfile();
    }
  }, [session]);

  const showModal = () => {
    form.setFieldsValue({
      name: userData.name,
      lastname: userData.lastname,
      rut: userData.rut,
      phone: userData.phone,
      mail: userData.mail,
    });
    setIsModalVisible(true);
  };

  // Validador personalizado para el campo RUT
  const validateRutField = (_, value) => {
    if (!value) {
      return Promise.reject("El RUT es requerido");
    }
    // Verifica el formato: exactamente 8 dígitos, un guión y 1 dígito o la letra k/K.
    const formatRegex = /^\d{8}-[0-9kK]$/;
    if (!formatRegex.test(value)) {
      return Promise.reject("Formato Incorrecto. Ej: 99999999-9");
    }
    // Verifica la validez del dígito verificador usando el helper
    if (!validaRut(value)) {
      return Promise.reject("RUT no válido. Intenta nuevamente");
    }
    return Promise.resolve();
  };

  // Validador para el campo teléfono: debe tener exactamente 9 dígitos.
  const validatePhoneField = (_, value) => {
    if (!value) {
      return Promise.reject("El teléfono es requerido");
    }
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(value)) {
      return Promise.reject("El teléfono debe contener exactamente 9 números");
    }
    return Promise.resolve();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Error al actualizar el perfil");
      const updatedUser = await res.json();
      // Preservamos el token del usuario
      const updatedUserWithToken = { ...updatedUser, token: session.token };
      setUserData(updatedUserWithToken);
      showUniqueToast.success("Datos actualizados correctamente", {
        position: "bottom-right",
        autoClose: 3000,
        theme: "dark",
      });
      setIsModalVisible(false);
      // Actualizamos la sesión con el objeto que incluye el token
      handleSession(updatedUserWithToken);
    } catch (error) {
      console.error(error);
      showUniqueToast.error(error.message, {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-4">
      {loadingProfile ? (
        <div className="flex justify-center items-center">
          <Spin tip="Cargando los datos del usuario...">
            <div style={{ width: "350px", height: "150px" }} />
          </Spin>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <p>
              <strong>Nombre:</strong> {userData.name}
            </p>
            <p>
              <strong>Apellido:</strong> {userData.lastname}
            </p>
            <p>
              <strong>RUT:</strong>{" "}
              {userData.rut ? (
                userData.rut
              ) : (
                <span className="text-red-500">No registrado</span>
              )}
            </p>
            <p>
              <strong>Teléfono:</strong>{" "}
              {userData.phone ? (
                userData.phone
              ) : (
                <span className="text-red-500">No registrado</span>
              )}
            </p>
            <p>
              <strong>Correo:</strong> {userData.mail}
            </p>
          </div>
          <Button type="primary" className="mt-4" onClick={showModal}>
            Editar datos
          </Button>
        </>
      )}

      <Modal
        title="Editar Mis Datos"
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
            name="rut"
            label={
              <span>
                RUT{" "}
                <i
                  style={{
                    fontStyle: "italic",
                    fontSize: "0.85em",
                    color: "#555",
                  }}
                >
                  (Formato: 99999999-9)
                </i>
              </span>
            }
            rules={[
              { required: true, message: "El RUT es requerido" },
              { validator: validateRutField },
            ]}
            validateTrigger={[]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Teléfono"
            rules={[
              { required: true, message: "El teléfono es requerido" },
              { validator: validatePhoneField },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mail"
            label="Correo"
            rules={[
              { required: true, message: "El correo es requerido" },
              { type: "email", message: "Ingrese un correo válido" },
            ]}
          >
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MisDatos;
