# :octocat: MaleArcade - Sala de Juegos :game_die:

Alumna: Cortes Malena Nahir 
Division: 141 

- Proyecto generado usando [Angular CLI](https://github.com/angular/angular-cli) version 20.2.1. 
- Deploy en hosting de Vercel. [Visualizar](https://male-arcade-sala-de-juegos-cortes-m.vercel.app/)
- Base de datos PostgreSQL, Supabase.

## Sobre el proyecto :pushpin: 

Contenido de la aplicación.
La “Sala de Juegos” tiene que contar con los siguientes puntos:

1. Aplicación frontend en Angular.

2. Servidor: Utilizar Supabase o Firebase.

3. Login y registro de usuarios: Autenticación y guardado de datos en base de datos.

4. Lógica de juegos:
    - Ahorcado.
    - Mayor o menor.
    - Preguntados.
    - Juego propio.

5. Juego propio: No deber ser ninguno de los siguientes:
    - Tatetí.
    - Memotest.
    - Piedra, papel o tijeras.

6. Sala de chat:

    - Debe ser una única sala que les permita a todos los usuarios registrados y logueados
    enviar mensajes y que se vean automáticamente (sin recargar la página).

7. Experiencia de usuario:
    - Las pantallas deben contar con diseño trabajado y uniforme a lo largo de la aplicación.
    - Navegación entre pantallas.
    - Información clara y completa al mostrar mensajes o realizar acciones.
    - Experiencia de usuario en los juegos. Tiempo de finalización / puntuación conseguida.

8. Diseño y estilos:
    - Utilización de bootstrap, primeNG o cualquier librería / paquete de estilos.
    - Utilización de animaciones (css y/o typescript).
    - Favicon de la aplicación.

9. Listados de resultados.

- (10)Presentación. Página “Quién soy”:
    - Datos personales del alumno.
    - Imagen del alumno.
    - Explicación del juego propio.


## Estructuración de carpetas :file_folder:

Aqui se puede ver la estructuración de las carpetas más relevantes hasta el momento.

```
MaleArcade-SalaDeJuegos-CortesMalena/
├── public/
│   └── favicon/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── nav/
│   │   │   └── usuario-card/
│   │   ├── pages/
│   │   │   ├── bienvenida/
│   │   │   ├── login/
│   │   │   ├── quien-soy/
│   │   │   └── registro/
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── supabase.ts
│   │   ├── app.ts
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── assets/
│   │   ├── icons/
│   │   └── img/
│   ├── environments/
│   │   └── supabase.config.ts
│   └── index.html
├── angular.json
├── package.json
└── readme.md
```

# Spints :calendar:
Aquí se podran visualizar los spints realizados:

## Sprint #1 v1.0.0 :round_pushpin:
- Creación del proyecto. :heavy_check_mark:
- Deploy en hosting (vercel, firebase, etc.). :heavy_check_mark:
- Componentes creados: :heavy_check_mark:
    - Login 
    - Registro
    - Bienvenida / Home
    - Quién Soy
- Navegación entre componentes. :heavy_check_mark:
- Funcionalidad - Componente Quién Soy: :heavy_check_mark:
    - Traer los datos del alumno desde la api de github.
    - Mostrar nombre del alumno, imagen de perfil y más datos.
    - Explicar de forma clara la elección del juego propio y cómo jugarlo.
- Implementar un favicon propio. :heavy_check_mark:
- Agregar estilado general, inspirado en lo retro :heavy_check_mark:

