exports.index = function(req, res){
    console.log(JSON.stringify(req.user));
    res.send('La temporada del Real Madrid ha acabado hoy...');
};