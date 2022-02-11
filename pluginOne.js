function load(router) {
  router.get('/count', (req, res) => {
    res.send({
        message: 'Hello from pluginOne'
    });
  })
}

module.exports = {
  load
};