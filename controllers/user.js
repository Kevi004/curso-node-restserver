
const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');



const usuariosGet = async(req = request, res = response) => {
    // const { q, nombre = "No name", apikey} = req.query;
    // Importancia de la desestructuracion 112 query
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [ total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number( desde ))
            .limit(Number(limite))
    ]);
    
    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res = response) => {
    const { id }= req.params;
    const {_id, pasword, google, correo, ...resto} = req.body;
    // validar contra base de datos
    if ( pasword ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.pasword = bcryptjs.hashSync( pasword, salt );
    }
    const usuario = await Usuario.findByIdAndUpdate( id, resto );
    res.json( usuario );
}

const usuariosPost = async (req, res = response) => {



    const { nombre, correo, pasword, rol} = req.body;
    const usuario = new Usuario(  {nombre, correo, pasword, rol} );
    
    // Verificar si el correo existe
 
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.pasword = bcryptjs.hashSync( pasword, salt );
    // Guardar en DB
    await usuario.save();
    res.json({
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg:'patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false });


    res.json({
        id
    });
}




module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete

}