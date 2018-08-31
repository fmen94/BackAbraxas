const router = require('express').Router();
const User = require('../models/User');
const Tarea= require('../models/Tarea')
const passport = require('passport');

//middlewares

function isAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.json({message:"no tienes permiso"});
    }
}

//signup

router.post("/signup", (req, res, next) => {
	console.log("entramos a sing")
    User.register(req.body, req.body.password)
      .then(user => {
        return res.status(200).json(user);
      })
      .catch(e => next(e));
  });

//logout 

 router.get('/logout', (req,res,next)=>{
    req.logout();
    res.json({message:"la sesión se ha cerrado"});
});
//login

router.post('/login', passport.authenticate('local',{ failureRedirect: '/error' }), (req,res,next)=>{
    res.send(req.user)
  });
  
//login Error
router.get('/error', (req, res) => {
    res.json("Error")
})

//Home
router.get('/home/:id', isAuthenticated, (req, res) => {
    Tarea.find({user:req.params.id}).sort({updated_at:-1})
        .then(user => {
            if (!user) return res.status(404)
            return res.status(200).json(user);
        })
        .catch(err => {
            return res.status(500).json(err);
        });
});

//new tarea

router.post('/tarea', isAuthenticated, (req,res,next)=>{
    Tarea.create(req.body)
    .then(tarea=>{
        return res.status(200).json(tarea);
    })
    .catch(err => {
        return res.status(500).json(err);
    });

})

//edit tarea

router.put('/tarea/:id', isAuthenticated, (req,res,next)=>{
    Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(tarea=>{
        return res.status(200).json(tarea);
    })
    .catch(err => {
        return res.status(500).json(err);
    });

})

//delite tarea

router.delete('/tarea/:id', isAuthenticated, (req,res,next)=>{
    
    
    Tarea.findByIdAndRemove(req.params.id)
    .then(tarea=>{
        return res.status(200).json(tarea);
    })
    .catch(err => {
        return res.status(500).json(err);
    });
})

// my record

router.get('/record/:id', isAuthenticated, (req,res,next)=>{
    Tarea.find({user:req.params.id}).sort({ complete: -1 })
    .then(tareas=>{
        return res.status(200).json(tareas);
    })
    .catch(err => {
        return res.status(500).json(err);
    });
})

//random tareas
router.get('/random/:id', isAuthenticated, (req,res,next)=>{
    for(var i=0; i<50; i++){
        tar={
            user: req.params.id,
            title: "tarea no:"+i,
            description: "descripcion de la tarea",
            duration: time(),
        }
        Tarea.create(tar)
            .then(tarea=>{
                return res.status(200).json(tarea);
            })
            .catch(err => {
                return res.status(500).json(err);
            });
            }
})

function time(){
    var numCar=Math.floor(Math.random()*60);
    if(numCar<10){numCar="0"+numCar}
    var min=Math.floor(Math.random()*2);
    if(min<10){min="0"+min}
    
    return min+":"+numCar
    }

module.exports = router;
