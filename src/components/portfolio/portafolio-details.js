// import React, { Component } from "react";
// import axios from "axios";

// export default class PortfolioDetail extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       portfolioItem: {}
//     };
//   }

//   componentWillMount() {
//     this.getPortfolioItem();
//   }

//   getPortfolioItem() {
//     axios
//       .get(
//         `https://nahiki.devcamp.space/portfolio/portfolio_items/${
//           this.props.match.params.slug
//         }`,
//         { withCredentials: true }
//       )
//       .then(response => {
//         this.setState({
//           portfolioItem: response.data.portfolio_item
//         });
//       })
//       .catch(error => {
//         console.log("getportfolioitem error", error);
//       });
//   }

//   render() {
//     const {
//       banner_image_url,
//       category,
//       description,
//       logo_url,
//       name,
//       thumb_image_url,
//       url
//     } = this.state.portfolioItem;

//     return (
//       <div>
//         <h2>{name}</h2>
//         <p>{description}</p>
//       </div>
//     );
//   }
// }


import React, { Component } from "react";
import axios from "axios";
import Typed from "typed.js"; // Importamos Typed.js

export default class PortfolioDetail extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      portfolioItem: {},
      isDescriptionLoaded: false, // Nuevo estado para verificar si la descripción está cargada
    };
    this.typedRef = React.createRef(); // Referencia para Typed.js
  }

  componentDidMount() {
    this.getPortfolioItem();
  }

  getPortfolioItem() {
    axios
      .get(
        `https://nahiki.devcamp.space/portfolio/portfolio_items/${
          this.props.match.params.slug
        }`,
        { withCredentials: true }
      )
      .then(response => {
        this.setState({
          portfolioItem: response.data.portfolio_item,
          isDescriptionLoaded: true // Cambiamos el estado cuando la descripción está lista
        }, () => {
          this.initTyped(); // Iniciamos Typed.js después de que la descripción se haya cargado
        });
      })
      .catch(error => {
        console.log("getportfolioitem error", error);
      });
  }

  initTyped() {
    const options = {
      strings: [this.state.portfolioItem.description || ''], // Usamos la descripción cargada
      typeSpeed: 35, // Velocidad de escritura
      loop: false, // No queremos que se repita
      showCursor: false     // Ocultar el cursor de escritura
    };

    // Inicializamos Typed.js en el elemento referenciado
    this.typed = new Typed(this.typedRef.current, options);
  }

  componentWillUnmount() {
    // Limpiamos la instancia de Typed.js si el componente se desmonta
    if (this.typed) {
      this.typed.destroy();
    }
  }

  render() {
    const {
      banner_image_url,
      logo_url,
      name,
      url
    } = this.state.portfolioItem;

    const bannerStyles = {
      backgroundImage: "url(" + banner_image_url + ")",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center"
    };

    const logoStyles = {
      width: "200px"
    };

    return (
      <div className="portfolio-detail-wrapper">
        <div className="banner" style={bannerStyles}>
          <img src={logo_url} alt={name} style={logoStyles} className="logo-details" />
        </div>
    
        <div className="portfolio-detail-description-wrapper">
          <div className="description">
            {/* Usamos un span donde se aplicará la animación */}
            <p ref={this.typedRef}></p>
          </div>
        </div>
    
        <div className="bottom-content-wrapper">
          <a href={url} className="site-link" target="_blank" rel="noopener noreferrer">
            Go to {name}
          </a>
        </div>
    
        {/* Dos divs con sombra */}
        <div className="blur blur-f-1"></div>
        <div className="blur blur-f-2"></div>
      </div>
    );
    
  }
}
