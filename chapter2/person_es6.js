class PersonES6 {
    constructor(p) {
        this.age = p.age;
        this.name = p.name;
        this.sex = p.sex;
    }
    showInfo() {
        console.log(this);
    }
}


var person = new PersonES6({
    age:18,
    name:'tom',
    sex:'boy'
});

person.showInfo();
