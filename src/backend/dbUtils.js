var dbUtils = {
  saveDocument: (doc, res) => {
    doc.save(function(err) {
      if (err) {
        res.send(err);
      }
    });
  }
};

module.exports = dbUtils;