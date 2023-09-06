import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Cart = () =>{
    const[listePanier,setListePanier]=useState([])
    const [modifiedPaniers, setModifiedPaniers] = useState([]);

    useEffect(() => {
        fetchAllListe();
        
        ////////////////update\\\\\\\\\\\\\\\\\\\\
        const deletePan = async () => {
            try {
              await axios.delete(`http://localhost:8800/ActuCrud/deleteAllPan`);
            } catch (error) {
              console.log(error);
            }
        };
        const articlesPanier = JSON.parse(localStorage.getItem("panier")) || [];
        setListePanier(articlesPanier);

        // Gestionnaire pour vider le panier lorsque l'utilisateur ferme la fenêtre/onglet
        const handleBeforeUnload = () => {
            localStorage.removeItem("panier");
            deletePan();
        };

        // Ajoutez l'événement beforeunload au moment du montage du composant
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Nettoyage : Retirez l'événement beforeunload lorsque le composant est démonté
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
        
        ////////////////update\\\\\\\\\\\\\\\\\\\\

      }, []);
    
    const fetchAllListe=async()=>{
        try {
            /*const res=await axios.get(process.env.REACT_APP_SERVER+"/ActuCrud/listesPanier")
            setListePanier(res.data);*/
            const panier = JSON.parse(localStorage.getItem("panier")) || []
            setListePanier(panier);
            panier.forEach(produit => {
                console.log(produit.nomProduit, produit.prixUnitaire);
            });
        } catch (error) {
            console.log(error)
        }
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity <= 0) {
            newQuantity = 1;
        }
        // Créer une copie indépendante de chaque élément du panier
        const updatedListePanier = listePanier.map((item) =>
            item.id === id ? { ...item, quantite: newQuantity } : { ...item }
        );
        const updatedmodifPanier = listePanier.map((item) =>
            item.id === id ? { ...item, quantite: newQuantity,prixUnitaire:newQuantity*item.prixUnitaire } : { ...item }
        );
        setListePanier(updatedListePanier);

        // Vérifier si la quantité est supérieure à 1, et si c'est le cas, ajouter l'élément au tableau des paniers modifiés
        if (newQuantity > 1) {
            const modifiedPanier = updatedmodifPanier.find((item) => item.id === id);
            if (modifiedPanier) {
                setModifiedPaniers([...modifiedPaniers, modifiedPanier]);
            }
            console.log(modifiedPanier)
        }
    };
    const handleUpdateCart = async () => {
        /*try {
            // Boucle pour mettre à jour les paniers modifiés dans la base de données
            for (const modifiedPanier of modifiedPaniers) {
                await axios.put(`http://localhost:8800/ActuCrud/updatePanier/${modifiedPanier.id}`, modifiedPanier);
            }
            // Réinitialiser le tableau des paniers modifiés après la mise à jour
            setModifiedPaniers([]);
            alert("update successfuly!");
        } catch (error) {
            console.log(error);
        }*/
        const updatedCart = modifiedPaniers.reduce((cart, modifiedItem) => {
            const existingItemIndex = cart.findIndex(item => item.id === modifiedItem.id);
            if (existingItemIndex !== -1) {
                cart[existingItemIndex] = modifiedItem;
            } else {
                cart.push(modifiedItem);
            }
            return cart;
        }, listePanier);

        localStorage.setItem("panier", JSON.stringify(updatedCart));
        setListePanier(updatedCart);
        setModifiedPaniers([]);
    };
    const getTotal = () => {
        return listePanier.reduce(
          (total, item) => total + item.prixUnitaire * item.quantite,
          0
        );
    };

    const handleRemoveItem = async (id) => {
        try {
          // Effectuer une requête pour supprimer l'article du panier
          await axios.delete(`http://localhost:8800/ActuCrud/deletePanier/${id}`);
          // Rafraîchir la liste du panier après la suppression
          fetchAllListe();
        } catch (error) {
          console.log(error);
        }
    };

    return (
        <div>
            <div className="top-bar">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <i className="fa fa-envelope"></i>
                            support@email.com
                        </div>
                        <div className="col-sm-6">
                            <i className="fa fa-phone-alt"></i>
                            +012-345-6789
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="nav">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-md bg-dark navbar-dark">
                        <a href="#" className="navbar-brand">MENU</a>
                        <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
                        <div className="navbar-nav mr-auto">
                                <a className="nav-item nav-link active"><Link to="/" >Home</Link></a>
                                <a href="product-list.html" className="nav-item nav-link"><Link to="/listeProduit" >Products</Link></a>
                                <a href="product-detail.html" className="nav-item nav-link"><Link to="/listeProdAdmin" >Prod Admin</Link></a>
                                <a className="nav-item nav-link"><Link to="/cart" >Cart</Link></a>
                                <a href="checkout.html" className="nav-item nav-link">Checkout</a>
                                <a href="my-account.html" className="nav-item nav-link">My Account</a>
                                <div className="nav-item dropdown">
                                    <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">More Pages</a>
                                    <div className="dropdown-menu">
                                        <a className="dropdown-item"><Link to="/register" >Login & Register</Link></a>
                                        <a href="contact.html" className="dropdown-item">Contact Us</a>
                                    </div>
                                </div>
                            </div>
                            <div className="navbar-nav ml-auto">
                                <div className="nav-item dropdown">
                                    <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">User Account</a>
                                    <div className="dropdown-menu">
                                        <a href="#" className="dropdown-item">Login</a>
                                        <a href="#" className="dropdown-item">Register</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            
            <div className="bottom-bar">
                <div className="container-fluid">
                    <div className="row align-items-center">
                        <div className="col-md-3">
                            <div className="logo">
                                <a href="index.html">
                                    <img src="img/logo.png" alt="Logo"/>
                                </a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="search">
                                <input type="text" placeholder="Search"/>
                                <button><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="user">
                                
                                <a href="cart.html" className="btn cart">
                                    <i className="fa fa-shopping-cart"></i>
                                    <span>(0)</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="breadcrumb-wrap">
                <div className="container-fluid">
                    <ul className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item"><a href="#">Products</a></li>
                        <li className="breadcrumb-item active">Cart</li>
                    </ul>
                </div>
            </div>
            
            <div className="cart-page">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="cart-page-inner">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead className="thead-dark">
                                            <tr>
                                                <th>Product</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th>Remove</th>
                                            </tr>
                                        </thead>
                                        <tbody className="align-middle">
                                        {listePanier.map((listePan)=>(
                                            <tr key={listePan.id}>
                                                <td>
                                                    <div className="img">
                                                        <a href="#"><img src={`/img/${listePan.photo}`} alt="Image" /></a>
                                                        <p>{listePan.nomProduit}</p>
                                                    </div>
                                                </td>
                                                <td>{listePan.prixUnitaire}</td>
                                                
                                                <td>
                                                    <div className="qty">
                                                    <button className="btn-minus" onClick={() =>handleQuantityChange(listePan.id, listePan.quantite - 1)}>
                                                        <i className="fa fa-minus"></i>
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={listePan.quantite}
                                                        min="0"
                                                        onChange={(e) => {
                                                        const newQuantity = parseInt(e.target.value);
                                                        handleQuantityChange(listePan.id, newQuantity);
                                                        }}
                                                    />
                                                    <button
                                                        className="btn-plus"
                                                        onClick={() =>
                                                        handleQuantityChange(listePan.id, listePan.quantite + 1)
                                                        }
                                                    >
                                                        <i className="fa fa-plus"></i>
                                                    </button>
                                                    </div>
                                                </td>
                                                <td>${listePan.prixUnitaire * listePan.quantite}</td>

                                                
                                                <td> 
                                                    <button onClick={() => handleRemoveItem(listePan.id)}>
                                                        <i className="fa fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="cart-page-inner">
                                <div className="row">
                                    
                                    <div className="col-md-12">
                                        <div className="cart-summary">
                                            <div className="cart-content">
                                                <h1>Cart Summary</h1>
                                                <p>Sub Total<span>${getTotal()}</span></p>
                                                <h2>Grand Total<span>${getTotal()}</span></h2>
                                            </div>
                                            <div className="cart-btn">
                                                <button onClick={handleUpdateCart}>Update Cart</button>
                                                <button>Checkout</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="footer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <div className="footer-widget">
                                <h2>Get in Touch</h2>
                                <div className="contact-info">
                                    <p><i className="fa fa-map-marker"></i>123 E Store, Los Angeles, USA</p>
                                    <p><i className="fa fa-envelope"></i>email@example.com</p>
                                    <p><i className="fa fa-phone"></i>+123-456-7890</p>
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                    
                    <div className="row payment align-items-center">
                        <div className="col-md-6">
                            <div className="payment-method">
                                <h2>We Accept:</h2>
                                <img src="img/payment-method.png" alt="Payment Method" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="payment-security">
                                <h2>Secured By:</h2>
                                <img src="img/godaddy.svg" alt="Payment Security" />
                                <img src="img/norton.svg" alt="Payment Security" />
                                <img src="img/ssl.svg" alt="Payment Security" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        
            
        
            <div className="footer-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 copyright">
                            <p>Copyright &copy; <a href="https://htmlcodex.com">HTML Codex</a>. All Rights Reserved</p>
                        </div>

                        <div className="col-md-6 template-by">
                            <p>Template By <a href="https://htmlcodex.com">HTML Codex</a></p>
                        </div>
                    </div>
                </div>
            </div>
        

        </div>
    )
}

export default Cart