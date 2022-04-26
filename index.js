#!/usr/bin/env node
/* 
  La linea anterior es una instancia de una línea shebang: 
  la primera línea en un archivo ejecutable de texto sin formato en plataformas tipo Unix 
  que le dice al sistema a qué intérprete pasar ese archivo para su ejecución, 
  a través del comando línea siguiendo el prefijo máfico #! (llamado shebang).
  En Windows no admite líneas shebang, por lo que se ignoran allí; 
  en Windows, es únicamente la extensión del nombre de archivo de un archivo determinado 
  lo que determina qué ejecutable lo interpretará. 
  Sin embargo, aún los necesita en el contexto de npm.
*/
const chalk = require('chalk');
const figlet = require('figlet');
const inquirer = require('inquirer');
const fs = require('fs');
const pathBase = process.cwd();


let templateVUE = require('./templates/templateVUE');


const msn = msn => {
  console.log(chalk.bold.hex('#032d87')(figlet.textSync(msn, { 
    font:  'ANSI Shadow',
    horizontalLayout: 'fitted',
    verticalLayout: 'default'
  })));
}


const queryParams = () => {
  const qs = [{
      name: 'proyectoNombre',
      type: 'input',
      message: 'Escribe el nombre del proyecto'
    },{
      name: 'multiEmpresa',
      type: 'list',
      message: '¿El proyecto es multi empresa?: ',
      choices: [
        'Si',
        'No'
      ],
    }
    // , {
    //   name: 'type',
    //   type: 'list',
    //   message: 'Selecciona el tipo de elemento a crear: ',
    //   choices: [
    //     'Components',
    //     'Views',
    //     'Layouts',
    //     'Models',
    //     'Javascript',
    //   ],
    //},
  ];

  return inquirer.prompt(qs);
};

// Método que se encarga de crear el fichero en base a las preguntas realizadas
const createFile = (data) => {
  const extension = data.type === 'Javascript' ? 'js' : 'vue'
  const path = `${pathBase}\\src\\${data.type}`;
  const file = `${path}\\${data.proyectoNombre}.${extension}`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, 0777);
  }
  try {
    templateVUE = templateVUE.replace('$name', data.proyectoNombre);
    fs.writeFileSync(file, templateVUE, { mode: 0o777 });
  } catch(err) {
    console.error(err);
  } finally {
    console.log(`
      ------ CREADO CORRECTAMENTE ------\n
      Se ha creado el siguiente proyecto: ${chalk.hex('#032d87').bold(data.proyectoNombre)}\n
      - Es multi empresa : ${data.multiEmpresa=='Si'? chalk.green.bold(data.multiEmpresa): chalk.red.bold(data.multiEmpresa)}\n
      ----------------------------------\n
    `);
  }
}

// IIFE (Immediately Invoked Function Expression)
(async() => {
  msn('\n FS-CLIENT');
  createFile(await queryParams());
})();
