var Domain = require("../lib/Domain");
var should = require("should");


describe("Domain", function () {

    var domain;

    it("#new", function () {
        domain = new Domain();
    });

    it("#register", function () {

        domain.register("User", {
            changeName(name, di) {
                di.apply("changeName", name);
            },
            when(event, set) {
                if (event.name === "changeName") {
                    set("name", event.data);
                }
            }
        });

        should.exist(domain.repos["User"]);
        should.exist(domain.ActorClasses["User"]);

    });

    var uid;

    it("#create", function (done) {

        domain.addListener("User:create", function (event) {
            event.name.should.eql("create");
            done()
        })

        domain.create("User", {name: "brighthas"}, function (err, id) {
            uid = id;
            should.exist(id);
        });

    })

    it("#call", function (done) {
        domain.call({typeName:"User", actorId:uid, methodName:"changeName", data:"leo"});
        domain.get("User", uid, function (err,act) {
            act.id.should.eql(uid);
            done()
        })
    })

});