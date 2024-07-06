exports.doAdd = function (req, res) {
    const _body = req.body;
    const a = parseInt(_body.a, 10);
    if (isNaN(a)) {
        return res.send({ code: 1, msg: 'a值非法' });
    }
    const b = parseInt(_body.b, 10);
    if (isNaN(b)) {
        return res.send({ code: 2, msg: 'b值非法' });
    }
    res.send({ code: 0, data: a + b });
};