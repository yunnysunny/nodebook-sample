function PersonES5(p) {
    this.age = p.age;
    this.name = p.name;
    this.sex = p.sex;
}

PersonES5.prototype.showInfo = function() {
    console.log(this);
};

var person = new PersonES5({
    age:18,
    name:'tom',
    sex:'boy'
});

person.showInfo();

