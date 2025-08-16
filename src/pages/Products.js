import React, { useState, useEffect, useMemo } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ProductCard from "../components/ProductCard";
import { useSearch } from "../context/SearchContext";
import { useParams } from "react-router-dom";
import "../styles/Products.css";


const normalizeCategory = (cat) => {
  if (!cat) return "";
  return cat.trim().toLowerCase();
};

const Products = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { category } = useParams(); // ✅ get category from URL
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // ✅ Subcategories for each main category (added Tshirts)
  const subCategories = {
    men: ["all", "tshirts", "shirts", "jeans", "jackets"],
    women: ["all", "tshirts", "shirts", "jeans", "dresses", "jackets"],
    kids: ["all", "tshirts", "shorts", "jackets"],
  };

  useEffect(() => {
    if (category) {
      setSelectedCategory(category.toLowerCase());
      setSelectedSubCategory("all"); // reset subcategory on category change
    }
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Unnamed Product",
            price: data.price || 0,
            mainCategory: normalizeCategory(data.category) || "other", // 👈 main category
            subCategory: normalizeCategory(data.subCategory) || "all", // 👈 sub category
            imageUrl: data.imageUrl || data.image || "",
            description: data.description || "", // ✅ added description
          };
        });
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Filter products
  const filteredProducts = useMemo(() => {
    const term = (searchTerm || "").trim().toLowerCase();

    return products.filter((p) => {
      // Main category filter
      if (selectedCategory !== "all" && p.mainCategory !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (
        selectedCategory !== "all" &&
        selectedSubCategory !== "all" &&
        p.subCategory !== selectedSubCategory
      ) {
        return false;
      }

      // Search filter
      const matchSearch =
        term === "" ||
        (p.name || "").toLowerCase().includes(term) ||
        (p.mainCategory || "").includes(term) ||
        (p.subCategory || "").includes(term);

      return matchSearch;
    });
  }, [products, searchTerm, selectedCategory, selectedSubCategory]);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Title Section */}
      <div className="text-center mb-5">
        <h1 className="fw-bold text-dark mb-3">
          {selectedCategory === "all"
            ? "✨ Our Clothing Collection"
            : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Collection`}
        </h1>
        <p className="text-muted fs-5">
          Discover the latest trends in fashion for{" "}
          {selectedCategory === "all" ? "everyone" : selectedCategory}.
        </p>
        <hr className="w-25 mx-auto border-2 border-primary opacity-75" />
      </div>

      {/* Main Category buttons */}
      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        {["All", "Men", "Women", "Kids"].map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat.toLowerCase() ? "primary" : "outline-primary"}
            className="rounded-pill px-4 py-2 shadow-sm fw-semibold"
            onClick={() => {
              setSelectedCategory(cat.toLowerCase());
              setSelectedSubCategory("all");
              setSearchTerm("");
            }}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Subcategory buttons (only show if Men/Women/Kids selected) */}
      {selectedCategory !== "all" && subCategories[selectedCategory] && (
        <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
          {subCategories[selectedCategory].map((sub) => (
            <Button
              key={sub}
              variant={selectedSubCategory === sub ? "secondary" : "outline-secondary"}
              className="rounded-pill px-3 shadow-sm"
              onClick={() => setSelectedSubCategory(sub)}
            >
              {sub.charAt(0).toUpperCase() + sub.slice(1)}
            </Button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Products;
