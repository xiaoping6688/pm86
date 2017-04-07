
export default {
  session: async (req, res, next) => {
    if (req.session.user) {next();}
    else {
      res.status(403).send({data: {}, msg: 'session error'});
    }
  }
}
