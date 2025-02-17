// frontend/src/components/admin/EditarCatalogo.jsx
import { useState, useEffect } from "react";
import { Button, Switch, Modal, Spin } from "antd";
import { showUniqueToast } from "../../helpers/showUniqueToast.helper";
import { useAuth } from "../../hooks/useAuth";
import ProductForm from "./ProductForm";
import { useProductImages } from "../../hooks/useProductImages";

export const EditarCatalogo = () => {
  const { session } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [stockEdits, setStockEdits] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Agregar nuevo");
  const [editingProductId, setEditingProductId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);
  const [loadingStock, setLoadingStock] = useState({});
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);
  const [formData, setFormData] = useState({
    product: "",
    price: "",
    stock: "",
    ingredients: "",
    description: "",
    nutrition: "",
    weight: "",
    categories: [],
    isAvailable: false,
  });
  const [loading, setLoading] = useState(false);

  const {
    productImages,
    setProductImages,
    fileInputsRef,
    handleFileSelect,
    handleFileChange,
    handleDeleteImage,
  } = useProductImages(API_URL, session, editingProductId);

  // Función para cargar productos desde el endpoint GET /api/admin/products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener productos");
      const data = await res.json();
      const mapped = data.map((prod) => ({
        ...prod,
        name: prod.product, // renombramos para la UI
        isAvailable: prod.available,
        selectedForDeletion: false,
      }));
      setProducts(mapped);
    } catch (error) {
      console.error("Error fetching products:", error);
      showUniqueToast.error(error.message, { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar categorías desde el endpoint GET /api/categories
  const fetchAvailableCategories = () => {
    fetch(`${API_URL}/api/categories`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAvailableCategories(data))
      .catch((err) => {
        console.error("Error fetching categories:", err);
        showUniqueToast.error("Error al cargar categorías", {
          position: "bottom-right",
        });
      });
  };

  useEffect(() => {
    if (session?.token) {
      fetchProducts();
      fetchAvailableCategories();
    }
  }, [API_URL, session]);

  // Abrir modal para agregar un producto nuevo
  const openModalForAdd = () => {
    setModalTitle("Agregar nuevo");
    setEditingProductId(null);
    setFormData({
      product: "",
      price: "",
      stock: "",
      ingredients: "",
      description: "",
      nutrition: "",
      weight: "",
      categories: [],
      isAvailable: false,
    });
    setProductImages([null, null, null, null]);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Abrir modal para editar un producto existente
  const openModalForEdit = (product) => {
    setModalTitle("Editando producto");
    setEditingProductId(product.id);
    setFormData({
      product: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      ingredients: product.ingredients || "",
      description: product.description || "",
      nutrition: product.nutrition || "",
      weight: product.weight || "",
      categories: product.categories || [],
      isAvailable: product.isAvailable,
    });
    setProductImages(
      product.images && product.images.length
        ? product.images
        : [null, null, null, null]
    );
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  // Validación del formulario: todos los campos obligatorios y al menos imagen principal
  const validateForm = () => {
    const errors = {};
    if (!formData.product) errors.product = true;
    if (formData.price === "") errors.price = true;
    if (formData.stock === "") errors.stock = true;
    if (!formData.ingredients) errors.ingredients = true;
    if (!formData.description) errors.description = true;
    if (!formData.nutrition) errors.nutrition = true;
    if (formData.weight === "") errors.weight = true;
    if (!formData.categories || formData.categories.length === 0)
      errors.categories = true;
    if (!productImages[0]) errors.productImages = true;
    return errors;
  };

  // Función para guardar (crear o editar) el producto
  const handleSaveModal = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      showUniqueToast.error(
        "Completa todos los campos obligatorios y carga al menos una imagen.",
        { position: "bottom-right" }
      );
      return;
    }
    setIsModalSubmitting(true);
    const payload = {
      product: formData.product,
      price: Number(formData.price),
      stock: Number(formData.stock),
      ingredients: formData.ingredients,
      description: formData.description,
      nutrition: formData.nutrition,
      weight: Number(formData.weight),
      categories: formData.categories,
      available: formData.isAvailable,
      images: [],
    };
    try {
      let response, data, productId;
      if (!editingProductId) {
        // Crear producto sin imágenes (se crean luego)
        response = await fetch(`${API_URL}/api/admin/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({ ...payload, images: [] }),
        });
        data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Error al agregar producto");
        }
        productId = data.id;
        // Subir imágenes para cada slot si es un File
        const uploadedImages = [];
        for (let i = 0; i < productImages.length; i++) {
          const slotImage = productImages[i];
          if (slotImage && slotImage instanceof File) {
            const formDataObj = new FormData();
            formDataObj.append("image", slotImage);
            formDataObj.append("productId", productId);
            const res = await fetch(`${API_URL}/api/upload`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session?.token}`,
              },
              body: formDataObj,
            });
            const uploadResult = await res.json();
            if (!res.ok) {
              throw new Error(uploadResult.error || "Error al subir imagen");
            }
            uploadedImages[i] = {
              secure_url: uploadResult.secure_url,
              public_id: uploadResult.public_id,
            };
          } else {
            uploadedImages[i] = slotImage;
          }
        }
        // Aseguramos que haya una imagen principal en el slot 0
        if (
          !uploadedImages[0] &&
          uploadedImages.filter((img) => img !== null).length === 1
        ) {
          const firstImg = uploadedImages.find((img) => img !== null);
          uploadedImages[0] = firstImg;
        }
        // Guardar las imágenes en la BD
        const imagesPayload = {
          productId,
          images: uploadedImages.filter((img) => img !== null),
        };
        const imagesResponse = await fetch(
          `${API_URL}/api/product-images/save-images`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.token}`,
            },
            body: JSON.stringify(imagesPayload),
          }
        );
        const imagesData = await imagesResponse.json();
        if (!imagesResponse.ok) {
          throw new Error(imagesData.error || "Error al guardar imágenes");
        }
        showUniqueToast.success("Producto agregado correctamente", {
          position: "bottom-right",
        });
      } else {
        // Editar producto existente
        response = await fetch(
          `${API_URL}/api/admin/products/${editingProductId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.token}`,
            },
            body: JSON.stringify({
              ...payload,
              images: productImages.filter((img) => img !== null),
            }),
          }
        );
        data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Error al editar producto");
        }
        showUniqueToast.success("Producto actualizado correctamente", {
          position: "bottom-right",
        });
      }
      setIsModalOpen(false);
      fetchProducts();
      fetchAvailableCategories();
    } catch (error) {
      showUniqueToast.error(error.message, { position: "bottom-right" });
    } finally {
      setIsModalSubmitting(false);
    }
  };

  // Actualizar stock
  const handleSaveStock = async (id) => {
    const newStockValue = stockEdits[id];
    if (newStockValue !== undefined) {
      const parsedStock = Number(newStockValue);
      setLoadingStock((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          `${API_URL}/api/admin/products/${id}/stock`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.token}`,
            },
            body: JSON.stringify({ stock: parsedStock }),
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Error al actualizar stock");
        }
        showUniqueToast.success("Stock actualizado", {
          position: "bottom-right",
        });
        fetchProducts();
      } catch (error) {
        showUniqueToast.error(error.message, { position: "bottom-right" });
      } finally {
        setLoadingStock((prev) => ({ ...prev, [id]: false }));
      }
    }
  };

  // Actualizar disponibilidad
  const handleToggleAvailability = (id, checked) => {
    const product = products.find((p) => p.id === id);
    fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      body: JSON.stringify({
        product: product.name,
        price: product.price,
        stock: product.stock,
        ingredients: product.ingredients,
        description: product.description,
        nutrition: product.nutrition,
        weight: product.weight,
        categories: product.categories || [],
        available: checked,
      }),
    })
      .then((res) => res.json())
      .then(() => fetchProducts())
      .catch((err) => {
        showUniqueToast.error(err.message, { position: "bottom-right" });
      });
  };

  // Marcar para eliminación
  const handleSelectForDeletion = (id, isChecked) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, selectedForDeletion: isChecked } : prod
      )
    );
  };

  // Eliminar productos seleccionados
  const handleDeleteSelected = () => {
    const selectedIds = products
      .filter((p) => p.selectedForDeletion)
      .map((p) => p.id);
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) {
      return;
    }
    setIsDeletingSelected(true);
    Modal.confirm({
      title: "¿Estás seguro?",
      content: `Vas a eliminar ${selectedIds.length} productos`,
      okText: "Eliminar",
      cancelText: "Cancelar",
      onOk: async () => {
        try {
          const response = await fetch(`${API_URL}/api/admin/products`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.token}`,
            },
            body: JSON.stringify({ productIds: selectedIds }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Error al eliminar productos");
          }
          showUniqueToast.success("Productos eliminados", {
            position: "bottom-right",
          });
          fetchProducts();
          fetchAvailableCategories();
        } catch (error) {
          showUniqueToast.error(error.message, { position: "bottom-right" });
        } finally {
          setIsDeletingSelected(false);
        }
      },
      onCancel: () => {
        setIsDeletingSelected(false);
      },
    });
  };

  // Desmarcar todos los productos seleccionados
  const handleEmptySelected = () => {
    setProducts((prev) =>
      prev.map((prod) => ({ ...prod, selectedForDeletion: false }))
    );
  };

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-4">
        {/* Sección de acciones */}
        <div className="mb-4">
          <Button
            type="primary"
            className="mr-6"
            onClick={openModalForAdd}
            disabled={isDeletingSelected || isModalSubmitting}
          >
            Agregar Nuevo Producto
          </Button>
          <Button
            type="dashed"
            className="mr-6"
            onClick={handleEmptySelected}
            disabled={isDeletingSelected || isModalSubmitting}
          >
            Desmarcar Seleccionados
          </Button>
          <Button
            danger
            onClick={handleDeleteSelected}
            disabled={isDeletingSelected || isModalSubmitting}
          >
            Eliminar Seleccionados
          </Button>
        </div>
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin tip="Cargando productos de la tienda...">
              <div style={{ width: "350px", height: "150px" }} />
            </Spin>
          </div>
        ) : (
          <div className="max-h-[calc(100vh-200px)] max-w-4xl overflow-y-auto p-8">
            {products.map((product) => {
              const tempStock = stockEdits[product.id];
              const stockInputValue =
                tempStock !== undefined ? tempStock : product.stock;
              return (
                <div key={product.id} className="flex items-start mb-4">
                  <div className="w-[100px] h-[100px] bg-gray-400 mr-4 flex items-center justify-center">
                    {product.url_img ? (
                      <img
                        src={product.url_img}
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      "Imagen"
                    )}
                  </div>
                  <div className="mr-8">
                    <strong>{product.name}</strong>
                    <p>Stock actual: {product.stock} unidades</p>
                    <div className="mb-2 flex items-center gap-2">
                      <label className="mr-2">Modificar stock:</label>
                      <input
                        type="text"
                        className="w-16 text-right appearance-none border border-gray-300 rounded px-1"
                        value={stockInputValue}
                        onChange={(e) =>
                          setStockEdits((prev) => ({
                            ...prev,
                            [product.id]: e.target.value.replace(/\D/g, ""),
                          }))
                        }
                      />
                      <Button
                        className="ml-2"
                        type="default"
                        onClick={() => handleSaveStock(product.id)}
                        disabled={loadingStock[product.id]}
                      >
                        Guardar
                      </Button>
                    </div>
                    <Button
                      type="link"
                      className="p-0"
                      onClick={() => openModalForEdit(product)}
                      disabled={isDeletingSelected || isModalSubmitting}
                    >
                      Editar datos producto
                    </Button>
                  </div>
                  <div className="mr-4">
                    <div className="mb-2">
                      <span className="mr-1">Disponible:</span>
                      <Switch
                        checked={product.isAvailable}
                        onChange={(checked) =>
                          handleToggleAvailability(product.id, checked)
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-1">
                    <label>
                      <input
                        type="checkbox"
                        className="mr-1"
                        checked={product.selectedForDeletion}
                        onChange={(e) =>
                          handleSelectForDeletion(product.id, e.target.checked)
                        }
                      />
                      Eliminar
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      {/* Renderizamos el ProductForm (Modal) cuando isModalOpen es true */}
      {isModalOpen && (
        <ProductForm
          modalTitle={modalTitle}
          isModalOpen={isModalOpen}
          confirmLoading={isModalSubmitting}
          formData={formData}
          setFormData={setFormData}
          formErrors={formErrors}
          availableCategories={availableCategories}
          productImages={productImages}
          fileInputsRef={fileInputsRef}
          handleFileSelect={handleFileSelect}
          handleFileChange={handleFileChange}
          handleDeleteImage={handleDeleteImage}
          onCancel={handleCancelModal}
          onSave={handleSaveModal}
        />
      )}
    </div>
  );
};

export default EditarCatalogo;
