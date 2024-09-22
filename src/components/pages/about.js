import React, { useEffect, useRef } from "react";  // Importamos React y los hooks necesarios
import profilePicture from "../../../static/assets/images/bio/nrodrigu.jpg"; 
import Typed from "typed.js";  // Importamos la librería Typed.js para animar el texto

export default function() {
  // Creamos una referencia para poder usar Typed.js y controlar la instancia
  const typedRef = useRef(null);

  // Hook useEffect que se ejecuta cuando el componente se monta y se desmonta
  useEffect(() => {
    // Opciones de configuración para Typed.js
    const colors = ["#FF5733", "#33FF57", "#3357FF"];  // Colores para cada frase
    const options = {
      strings: [
        "Full Stack Developer",          // Primer texto a mostrar
        "Frontend Enthusiast",           // Segundo texto a mostrar                
        "Technology Lover"               // Tercer texto a mostrar
      ],
      typeSpeed: 50,                     // Velocidad de escritura (en milisegundos)
      backSpeed: 30,                     // Velocidad para borrar el texto
      loop: true,                         // Hacemos que la animación se repita en bucle
      onStringTyped: (arrayPos) => {
        // Cambia el color del texto basado en la posición del string actual
        document.querySelector('.animated-text').style.color = colors[arrayPos];
      },
    };

    // Inicializamos Typed.js y lo aplicamos al span con la clase "animated-text"
    typedRef.current = new Typed(".animated-text", options);

    // Función de limpieza que destruye la instancia de Typed.js cuando el componente se desmonta
    return () => {
      typedRef.current.destroy();        // Evitamos que la animación continúe en segundo plano
    };
  }, []);  // El array vacío [] asegura que el efecto se ejecute solo una vez al montar y desmontar el componente


  return (
    <div className="content-page-wrapper">
      <div
        className="left-column"
        style={{
          background: "url(" + profilePicture + ") no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="right-column">
        <h1>Nahikari Rodriguez Nogales</h1>
        <h2>
          <span className="animated-text"></span>
        </h2>
        <p>
          Soy una apasionada desarrolladora de software en crecimiento.
          <br />
          Mi viaje comenzó con una curiosidad innata por la tecnología y desde entonces he estado inmersa en aprender y crecer en este emocionante campo. 
          Mi enfoque se centra en escribir código limpio, resolver problemas de manera eficiente y crear soluciones tecnológicas innovadoras. 
          Estoy emocionada por lo que el futuro me depara en mi carrera como desarrolladora de software y estoy ansiosa por colaborar en proyectos emocionantes. 
          <br />
          ¡Gracias por visitar mi portafolio!🚀
        </p>
      </div>
    </div>
  );
}
