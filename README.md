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
│   │   │   ├── chat/
│   │   │   ├── footer/
│   │   │   ├── ahorcado/
│   │   │   ├── buscar-el-tesoro/
│   │   │   ├── mayor-o-menor/
│   │   │   ├── preguntados/
│   │   │   └── usuario-card/
│   │   ├── pages/
│   │   │   ├── bienvenida/
│   │   │   ├── login/
│   │   │   ├── quien-soy/
│   │   │   └── registro/
│   │   ├── interfaces/
│   │   ├── guards/
│   │   ├── modals/
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── chat-service.ts
│   │   │   ├── juegos-service.ts
│   │   │   └── supabase.ts
│   │   ├── app.ts
│   │   ├── app.routes.ts
│   │   └── app.config.ts
│   ├── assets/
│   │   ├── cartas/
│   │   ├── icons/
│   │   └── img/
│   ├── environments/
│   │   └── environments.ts
│   └── index.html
├── angular.json
├── package.json
└── readme.md
```

# Spints :calendar:
Aquí se podran visualizar los spints realizados:

## Sprint #1 v1.0.0 
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

## Sprint #2 v2.0.0 :round_pushpin:
### Funcionalidad - Componente Bienvenida / Home:
- Tiene que ser el componente principal, desde este se podrán acceder a los diferentes
juegos y listados. :heavy_check_mark:
- Si el usuario NO está logueado, mostrar los botones de registro e inicio de sesión. :heavy_check_mark:
- Si el usuario está logueado, mostrar su nombre de usuario y un botón para cerrar sesión. :heavy_check_mark:
- Hasta no ver el tema “Guardias de ruta” o “Guards”, no es necesario bloquear los botones de los juegos, pero si ocultar los botones que no deberían verse. :heavy_check_mark:

### Funcionalidad - Inicio de sesión:
- Tiene que validar al usuario frente a supabase / firebase utilizando correo y contraseña. :heavy_check_mark:
- En caso de que el inicio de sesión sea exitoso, navegar automáticamente al Home. :heavy_check_mark:
- En caso de que el inicio de sesión no sea exitoso, mostrar un mensaje con el respectivo
error. :heavy_check_mark:
- La página de login debe contar con tres botones de inicio de sesión rápido, que le permitan a quién esté probando la aplicación ingresar automáticamente con usuarios
previamente registrados para que las pruebas sean más ágiles. :heavy_check_mark:

### Funcionalidad: Registro.
- Cuenta con un formulario que permite registrar a un usuario. Crea su cuenta en el
sistema de autenticación y guarda sus datos en la base de datos. Nota: la contraseña no
se guarda. :heavy_check_mark:
- El usuario debe ingresar su correo, nombre, apellido, edad y contraseña. :heavy_check_mark:
- Una vez cargados todos los datos, y el usuario se registra correctamente, se debe iniciar
sesión con ese usuario y navegar automáticamente al Home. :heavy_check_mark:
- Emitir mensaje si el usuario ya se encuentra registrado. :heavy_check_mark:

##  Sprint #3 :round_pushpin:
##  Juego: Ahorcado. :heavy_check_mark:
○ Deben mostrarse botones que simbolicen a todas las letras del abecedario. La entrada de
datos es a través de botones, NO el teclado.
○ Al finalizar la partida, guardar en la base de datos: el usuario que jugó, junto con el
tiempo de finalización, cantidad de letras selecionadas, etc.
##  Juego: Mayor o Mentor. :heavy_check_mark:
○ Se muestra una de una baraja de naipes. Se debe adivinar si la próxima carta va a ser un
número mayor o un número menor.
○ Al finalizar la partida, guardar en la base de datos: el usuario que jugó, cantidad de cartas
acertadas, etc.
##  Sala de chat: :heavy_check_mark:
○ Se debe mostrar el chat global para los usuarios logueados.
○ Se debe permitir enviar un mensaje a la sala de chat.
○ Al enviar un mensaje, este se guarda en la base de datos con el usuario que lo envió, el
mensaje y la fecha de envío.
○ Al guardar el mensaje, se debe mostrar en todos los clientes el nuevo mensaje
automáticamente (se debe estar suscrito al servicio de base de datos en tiempo real).
○ Se debe mostrar quién envía cada mensaje y a qué hora. El mensaje propio debe
diferenciarse del resto.
