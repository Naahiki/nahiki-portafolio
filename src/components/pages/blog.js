import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BlogItem from "../blog/blog-item";
import BlogModal from "../modals/blog-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Blog extends Component {
  constructor() {
    super();

    this.state = {
      blogItems: [],
      totalCount: 0,
      currentPage: 0,
      isLoading: true,
      blogModalIsOpen: false
    };

    this.getBlogItems = this.getBlogItems.bind(this);
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener("scroll", this.onScroll, false);
    this.handleNewBlogClick = this.handleNewBlogClick.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleSuccessfulNewBlogSubmission = this.handleSuccessfulNewBlogSubmission.bind(this);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick(blog) {
    axios
      .delete(
        `https://api.devcamp.space/portfolio/portfolio_blogs/${blog.id}`,
        { withCredentials: true }
      )
      .then(response => {
        this.setState({
          blogItems: this.state.blogItems.filter(blogItem => {
            return blog.id !== blogItem.id;
          })
        });

        return response.data;
      })
      .catch(error => {
        console.log("delete blog error", error);
      });
  }

  handleSuccessfulNewBlogSubmission(blog) {
    this.setState({
      blogModalIsOpen: false,
      blogItems: [blog].concat(this.state.blogItems)
    });
  }

  handleModalClose() {
    this.setState({
      blogModalIsOpen: false
    });
  }


  handleNewBlogClick() {
    this.setState({
      blogModalIsOpen: true
    });
  }

 //PASO 1
  // activateInfiniteScroll() {
  //   window.onscroll = () => {
  //     console.log("window.innerHeight", window.innerHeight);
  //     console.log(
  //       "document.documentElement.scrollTop", 
  //       document.documentElement.scrollTop
  //     ); // el unico que es dinamico es este
  //     console.log(
  //       "document.documentElement.offsetHeight", 
  //       document.documentElement.offsetHeight
  //     );
  //   };
  
  // }

  //PASO 2
// activateInfiniteScroll() {
//   // Definimos el evento onscroll en el objeto window
//   window.onscroll = () => {
//     // Comprobamos si el usuario ha llegado al final de la página.
//     // window.innerHeight: Altura visible de la ventana (parte del contenido que se puede ver sin desplazarse)
//     // document.documentElement.scrollTop: Posición actual del scroll desde la parte superior del documento
//     // document.documentElement.offsetHeight: Altura total del documento (incluyendo la parte no visible)
    
//     if (
//       window.innerHeight + document.documentElement.scrollTop ===
//       document.documentElement.offsetHeight
//     ) {
//       // Si el scroll ha llegado al final de la página-->
//       this.getBlogItems();
//     }
//   };
// }

 //PASO 3
//  activateInfiniteScroll() {
//   // Asignamos una función a `window.onscroll` para que se ejecute cada vez que el usuario haga scroll en la página.
//   window.onscroll = () => {
    
//     // Verificamos si ya estamos cargando datos (`isLoading` es verdadero)
//     // o si hemos cargado todos los elementos posibles (`blogItems.length === totalCount`).
//     // Si alguna de estas condiciones es verdadera, no hacemos nada y salimos de la función.
//     if (
//       this.state.isLoading ||
//       this.state.blogItems.length === this.state.totalCount
//     ) {
//       return;
//     }

//     // Comprobamos si el usuario ha llegado al final de la página.
//     // `window.innerHeight` es la altura de la ventana visible.
//     // `document.documentElement.scrollTop` es la cantidad que se ha desplazado hacia abajo.
//     // `document.documentElement.offsetHeight` es la altura total del documento.
//     if (
//       window.innerHeight + document.documentElement.scrollTop ===
//       document.documentElement.offsetHeight
//     ) {
//       // Si estamos al final de la página, llamamos a `getBlogItems` para cargar más elementos.
//       this.getBlogItems();
//     }
//   };
// }

 //PASO 4 --> Yo no tenia memory Leaks

//  onScroll() {
//   if (
//     this.state.isLoading ||
//     this.state.blogItems.length === this.state.totalCount
//   ) {
//     return;
//   }

//   if (
//     window.innerHeight + document.documentElement.scrollTop ===
//     document.documentElement.offsetHeight
//   ) {
//     this.getBlogItems();
//   }
// }

//Funcion mejorada para que no solo haga scroll en pantalla 100%
onScroll() {
  if (
    this.state.isLoading ||
    this.state.blogItems.length === this.state.totalCount
  ) {
    return;
  }

    // Usar >= en lugar de === para manejar redondeos y zoom del navegador
    // Añadir un margen de tolerancia (-1) para asegurar que el scroll infinito se active
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 1
  ) {
    this.getBlogItems();
  }
}

getBlogItems() {
  this.setState({
    currentPage: this.state.currentPage + 1
  });

  axios
    .get(
      `https://nahiki.devcamp.space/portfolio/portfolio_blogs?page=${this
        .state.currentPage}`,
      {
        withCredentials: true
      }
    )
    .then(response => {
      console.log("gettting", response.data);
      this.setState({
        blogItems: this.state.blogItems.concat(response.data.portfolio_blogs),
        totalCount: response.data.meta.total_records,
        isLoading: false
      });
    })
    .catch(error => {
      console.log("getBlogItems error", error);
    });
}


  componentWillMount() {
    this.getBlogItems();
  }

  // render() {
  //   const blogRecords = this.state.blogItems.map(blogItem => {
  //     return (
  //       <div className="content-container" >
  //         <BlogItem key={blogItem.id} blogItem={blogItem} />
  //       </div>
  //     );
  //   });

  render() {
    const blogRecords = this.state.blogItems.map(blogItem => {
      if (this.props.loggedInStatus === "LOGGED_IN") {
        return (
          <div className="content-container" key={blogItem.id}>
            <div className="admin-blog-wrapper">
              <BlogItem blogItem={blogItem} />
              <a onClick={() => this.handleDeleteClick(blogItem)}>
                <FontAwesomeIcon icon="trash" />
              </a>
            </div>
          </div>
        );
      } else {
        return (
          <div className="content-container" key={blogItem.id}>
            <BlogItem blogItem={blogItem} />
          </div>
        );
      }
    });
  
    return (
      <div className="main-container">
          <BlogModal
          handleSuccessfulNewBlogSubmission={this.handleSuccessfulNewBlogSubmission}
          handleModalClose={this.handleModalClose}
          modalIsOpen={this.state.blogModalIsOpen}
          />


        <div className="blog-container">{blogRecords}</div>
        {this.state.isLoading ? (
        <div className="content-loader"><FontAwesomeIcon icon="spinner" spinPulse /></div>
      ) : null}

      
      {this.props.loggedInStatus === "LOGGED_IN" ? (
          <div className="new-blog-link">
            <a onClick={this.handleNewBlogClick}>
              <FontAwesomeIcon icon="square-plus" />
            </a>
          </div>
        ) : null}
      </div>
    );
  }
  
}

export default Blog;