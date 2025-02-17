// src/components/customer/MisDirecciones.jsx
import { useState, useEffect } from "react";
import {
  Checkbox,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Tooltip,
  message,
  Spin,
} from "antd";
import { useAuth } from "../../hooks/useAuth";
import { showUniqueToast } from "../../helpers/showUniqueToast.helper";

const { Option } = Select;

export const MisDirecciones = () => {
  const { session } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado para el modal de agregar/editar dirección
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Estados para datos maestros de ubicación
  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);

  // Estados para controlar la selección en los Selects
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);

  const [form] = Form.useForm();

  // Función para obtener direcciones registradas
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener direcciones");
      const data = await res.json();
      setAddresses(data);
    } catch (error) {
      console.error(error);
      message.error("Error al cargar las direcciones");
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener todos los datos de ubicación desde el endpoint único
  const fetchLocationData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/location/all`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setRegions(data.regions);
        setProvinces(data.provinces);
        setCities(data.cities);
      }
    } catch (error) {
      console.error("Error fetching location data", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
    fetchLocationData();
  }, []);

  // Handlers de selección
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(addresses.map((addr) => addr.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectAddress = (id, checked) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Abrir modal para agregar nueva dirección
  const handleAddAddress = () => {
    setEditingAddress(null);
    form.resetFields();
    setSelectedRegion(null);
    setSelectedProvince(null);
    setIsModalVisible(true);
  };

  // Abrir modal para editar dirección (cargando valores ya registrados)
  const handleEditAddress = (address) => {
    setEditingAddress(address);
    form.setFieldsValue({
      region: address.regionid, // usar regionid en minúscula
      province: address.provinceid, // usar provinceid en minúscula
      city: address.cityid, // usar cityid en minúscula
      address: address.address,
      postal_code: address.postal_code,
      main: address.main,
    });
    setSelectedRegion(address.regionid);
    setSelectedProvince(address.provinceid);
    setIsModalVisible(true);
  };

  // Envío del formulario para agregar/editar dirección
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (values.postal_code && !/^\d+$/.test(values.postal_code)) {
        form.setFields([
          { name: "postal_code", errors: ["Debe contener solo números"] },
        ]);
        return;
      }
      const payload = {
        id_city: values.city, // se espera que el select de ciudad devuelva el id
        address: values.address,
        postal_code: values.postal_code || null,
        // Si no hay direcciones, se fuerza a principal; de lo contrario, se toma el valor del checkbox
        main: addresses.length === 0 ? true : values.main || false,
      };

      let res;
      if (editingAddress) {
        res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/address/${editingAddress.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/address`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`,
          },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Error al guardar la dirección");
      message.success("Dirección guardada correctamente");
      setIsModalVisible(false);
      fetchAddresses();
    } catch (error) {
      console.error(error);
      message.error(error.message);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Eliminación de direcciones seleccionadas
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;

    // Si se intenta eliminar la única dirección existente, mostrar toast
    if (addresses.length === 1 && addresses[0].main) {
      showUniqueToast.warning(
        "No se puede eliminar la única dirección. Debes agregar nueva dirección y cambiarla a principal",
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );
      return;
    }

    const mainAddress = addresses.find((addr) => addr.main);
    if (
      mainAddress &&
      selectedIds.includes(mainAddress.id) &&
      addresses.length > 1
    ) {
      Modal.confirm({
        title: "Eliminar dirección principal",
        content:
          "Estás eliminando la dirección principal. Selecciona otra dirección para que sea la principal.",
        okText: "Seleccionar y eliminar",
        cancelText: "Cancelar",
        onOk: async () => {
          const remaining = addresses.filter(
            (addr) => !selectedIds.includes(addr.id)
          );
          if (remaining.length === 0) {
            message.error("Debe dejar al menos una dirección.");
            return;
          }
          const newMainId = remaining[0].id;
          await fetch(
            `${import.meta.env.VITE_API_URL}/api/address/${newMainId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.token}`,
              },
              body: JSON.stringify({ main: true }),
            }
          );
          deleteAddresses();
        },
      });
    } else {
      deleteAddresses();
    }
  };

  const deleteAddresses = async () => {
    try {
      for (const id of selectedIds) {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/address/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error al eliminar dirección");
      }
      message.success("Direcciones eliminadas");
      setSelectedIds([]);
      fetchAddresses();
    } catch (error) {
      console.error(error);
      message.error("Error al eliminar direcciones");
    }
  };

  return (
    <div className="p-4">
      <div className="pl-5 mb-4 flex items-center gap-6">
        <Checkbox
          onChange={handleSelectAll}
          disabled={addresses.length === 0}
          checked={
            addresses.length > 0 && selectedIds.length === addresses.length
          }
        >
          Seleccionar todas
        </Checkbox>
        <Button type="primary" onClick={handleAddAddress}>
          Agregar dirección
        </Button>
        <Button
          onClick={handleDeleteSelected}
          disabled={selectedIds.length === 0}
        >
          Eliminar seleccionadas
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center">
          <Spin tip="Cargando direcciones del usuario...">
            <div style={{ width: "350px", height: "150px" }} />
          </Spin>
        </div>
      ) : addresses.length === 0 ? (
        <p>No tienes direcciones registradas.</p>
      ) : (
        <ul className="space-y-2">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="border p-5 rounded-md flex justify-between items-center"
            >
              <Checkbox
                onChange={(e) => handleSelectAddress(addr.id, e.target.checked)}
                checked={selectedIds.includes(addr.id)}
              />
              <span className="flex-1 ml-6">
                {addr.province} - {addr.city} - {addr.address}
                {addr.postal_code ? ` - ${addr.postal_code}` : ""}
                {addr.main && <strong> - Principal</strong>}
              </span>
              <Button type="link" onClick={() => handleEditAddress(addr)}>
                Editar
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal para agregar/editar dirección */}
      <Modal
        title={editingAddress ? "Editar Dirección" : "Agregar Dirección"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          {/* Checkbox para marcar dirección principal */}
          <Form.Item name="main" valuePropName="checked">
            <Checkbox>Dirección principal</Checkbox>
          </Form.Item>
          <Form.Item
            name="region"
            label="Región"
            rules={[{ required: true, message: "Seleccione una región" }]}
          >
            <Select
              placeholder="Seleccione una región"
              onChange={(value) => {
                setSelectedRegion(value);
                setSelectedProvince(null);
                form.setFieldsValue({ province: undefined, city: undefined });
              }}
              allowClear
            >
              {regions.map((reg) => (
                <Option key={reg.id} value={reg.id}>
                  {reg.region}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="province"
            label="Provincia"
            rules={[{ required: true, message: "Seleccione una provincia" }]}
          >
            <Select
              placeholder="Seleccione una provincia"
              onChange={(value) => {
                setSelectedProvince(value);
                form.setFieldsValue({ city: undefined });
              }}
              disabled={!selectedRegion}
              allowClear
            >
              {provinces
                .filter((prov) => prov.id_region === selectedRegion)
                .map((prov) => (
                  <Option key={prov.id} value={prov.id}>
                    {prov.province}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="city"
            label="Ciudad"
            rules={[{ required: true, message: "Seleccione una ciudad" }]}
          >
            <Select
              placeholder="Seleccione una ciudad"
              disabled={!selectedProvince}
              allowClear
            >
              {cities
                .filter((c) => c.id_province === selectedProvince)
                .map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.city}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="address"
            label="Dirección"
            rules={[{ required: true, message: "Ingrese la dirección" }]}
          >
            <Input placeholder="Escriba la dirección" />
          </Form.Item>
          <Form.Item
            name="postal_code"
            label={
              <span>
                Código Postal{" "}
                <Tooltip title="(opcional)">
                  <sup>?</sup>
                </Tooltip>
              </span>
            }
            rules={[{ pattern: /^\d*$/, message: "Solo se permiten números" }]}
          >
            <Input placeholder="Solo números" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MisDirecciones;
