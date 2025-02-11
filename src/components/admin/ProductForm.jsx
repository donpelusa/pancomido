// src/components/admin/ProductForm.jsx
import React from "react";
import { Modal, Switch, Button, Select, Input } from "antd";

const { Option } = Select;

const ProductForm = ({
  modalTitle,
  isModalOpen,
  confirmLoading,
  formData,
  setFormData,
  formErrors,
  availableCategories,
  productImages,
  fileInputsRef,
  handleFileSelect,
  handleFileChange,
  handleDeleteImage,
  onCancel,
  onSave,
}) => {
  return (
    <Modal
      title={modalTitle}
      open={isModalOpen}
      onOk={onSave}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <div className="flex gap-4">
        {/* Columna de imágenes: 4 cuadros */}
        <div className="flex flex-col gap-4">
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <div
                key={index}
                className={`relative w-[120px] h-[120px] flex items-center justify-center border ${
                  index === 0 ? "border-4 border-blue-500" : "border-gray-300"
                } rounded bg-gray-300 cursor-pointer`}
                title={
                  index === 0 ? "Imagen principal del producto en catálogo" : ""
                }
                onClick={() => handleFileSelect(index)}
              >
                {productImages[index] ? (
                  // Si es File se muestra preview usando URL.createObjectURL; sino se usa secure_url
                  typeof productImages[index] === "object" &&
                  productImages[index] instanceof File ? (
                    <img
                      src={URL.createObjectURL(productImages[index])}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <img
                      src={productImages[index].secure_url}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  )
                ) : (
                  <span>Cargar Imagen {index + 1}</span>
                )}
                {productImages[index] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(index);
                    }}
                    className="absolute top-1 right-1 bg-white text-xs px-1 py-0.5 rounded"
                  >
                    Eliminar
                  </button>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputsRef.current[index]}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, index)}
                />
              </div>
            ))}
        </div>
        {/* Columna del formulario */}
        <div className="flex-1">
          <div className="mb-4">
            <label className="block">Nombre:</label>
            <Input
              value={formData.product}
              onChange={(e) =>
                setFormData({ ...formData, product: e.target.value })
              }
              status={formErrors.product ? "error" : ""}
            />
          </div>
          <div className="mb-4 flex gap-4">
            <div className="flex-1">
              <label className="block">Valor:</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                status={formErrors.price ? "error" : ""}
              />
            </div>
            <div className="flex-1">
              <label className="block">Stock:</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                status={formErrors.stock ? "error" : ""}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block">Ingredientes:</label>
            <Input.TextArea
              rows={2}
              value={formData.ingredients}
              onChange={(e) =>
                setFormData({ ...formData, ingredients: e.target.value })
              }
              status={formErrors.ingredients ? "error" : ""}
            />
          </div>
          <div className="mb-4">
            <label className="block">Descripción:</label>
            <Input.TextArea
              rows={2}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              status={formErrors.description ? "error" : ""}
            />
          </div>
          <div className="mb-4">
            <label className="block">Nutricionales:</label>
            <Input.TextArea
              rows={2}
              value={formData.nutrition}
              onChange={(e) =>
                setFormData({ ...formData, nutrition: e.target.value })
              }
              status={formErrors.nutrition ? "error" : ""}
            />
          </div>
          <div className="mb-4 flex gap-4">
            <div className="w-1/3">
              <label className="block">Peso aprox(gr):</label>
              <Input
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
                status={formErrors.weight ? "error" : ""}
              />
            </div>
            <div className="w-2/3">
              <label className="block">Categorías:</label>
              <Select
                mode="tags"
                style={{ width: "100%" }}
                placeholder="Ingresa categorías y presiona Enter"
                onChange={(tagsArray) =>
                  setFormData({ ...formData, categories: tagsArray })
                }
                value={formData.categories}
                status={formErrors.categories ? "error" : ""}
                options={availableCategories.map((cat) => ({
                  value: cat.category,
                  label: cat.category,
                }))}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="mr-2">Disponible:</label>
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData({ ...formData, isAvailable: e.target.checked })
              }
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductForm;
