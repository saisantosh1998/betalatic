import chai from "chai";
import chaiHttp from "chai-http";
import { sequelize } from "./src/databases/postgres";
import { app } from "./src/index";
import { Cart } from "./src/models/Cart";

chai.use(chaiHttp);
const expect = chai.expect;

const intialItems = [
  `INSERT INTO items (code, name, price, promos, "createdAt", "updatedAt") VALUES ('A', 'Item A', 30,ARRAY[1],NOW(), NOW())`,
  `INSERT INTO items (code, name, price, promos, "createdAt", "updatedAt") VALUES ('B', 'Item B',20,ARRAY[2],NOW(), NOW())`,
  `INSERT INTO items (code, name, price, "createdAt", "updatedAt") VALUES ('C', 'Item C', 50, NOW(), NOW())`,
  `INSERT INTO items (code, name, price, "createdAt", "updatedAt") VALUES ('D', 'Item D', 15, NOW(), NOW())`,
];
const intialPromos = [
  `INSERT INTO promos (id, "itemCode", "requiredQuantity", "discountedPrice", "createdAt", "updatedAt") VALUES ('1', 'A', 3, 75.0, NOW(), NOW())`,
  `INSERT INTO promos (id, "itemCode", "requiredQuantity", "discountedPrice", "createdAt", "updatedAt") VALUES ('2', 'B', 2, 35.0, NOW(), NOW())`,
];
const intialCartPromos = [
  `INSERT INTO cartpromos (threshold, "discountAmount", "createdAt", "updatedAt") VALUES (150, 20, NOW(), NOW())`,
];

const sampleItem = {
  code: "A",
  name: "Item A",
  price: 30.0,
  promos: [1],
};

const sampleCartItems = [
  { itemCode: "A", quantity: 4 },
  { itemCode: "B", quantity: 4 },
];

describe("testing  cart and item controllers", () => {
  before(async () => {
    await sequelize.sync({ force: true });
    await sequelize.query(intialItems.join(";"));
    await sequelize.query(intialPromos.join(";"));
    await sequelize.query(intialCartPromos.join(";"));
  });

  describe("Cart Controller APIS", () => {

    describe("Post  /cart", () => {
      it("should create new cart and add item", async () => {
        const newItem = {
          itemCode: "A",
          quantity: 1,
        };

        const res = await chai
          .request(app)
          .post("/cart?create=true")
          .send(newItem);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("cart");
        expect(res.body.cart).to.have.property("items");
        let exists = res.body.cart.items.find(
          (item: any) => item.itemCode === newItem.itemCode
        );
        expect(exists).to.be.exist;
        expect(exists?.quantity).to.equal(newItem.quantity);
        const dbCart = await sequelize.query(
          `SELECT * FROM carts WHERE "id"=${res.body.cart.id}`
        );
        expect(dbCart[0].length).to.be.greaterThan(0); // Check if the query result contains rows
      });
      it("should update existing quantity when quantity changed and tried to add", async () => {
        const newItem = {
          itemCode: "A",
          quantity: 2,
        };

        const res = await chai.request(app).post("/cart?cartId=1").send(newItem);

        expect(res).to.have.status(200);
        expect(res.body).to.have.property("cart");
        expect(res.body.cart).to.have.property("items");
        let exists = res.body.cart.items.find(
          (item: any) => item.itemCode === newItem.itemCode
        );
        expect(exists).to.be.exist;
        expect(exists?.quantity).to.equal(newItem.quantity);

        const dbCartItems: any = await sequelize.query(
          `SELECT items FROM carts WHERE "id"=${res.body.cart.id}`
        );
        const itemsArray = dbCartItems[0][0].items;
        let existsSameInDB: any = itemsArray.find(
          (item: any) => item.itemCode === newItem.itemCode
        );
        expect(existsSameInDB).to.exist;
        expect(existsSameInDB?.quantity).to.equal(newItem.quantity);
      });
      it("should remove item if quantity is less than zero or zero", async () => {
        const newItem = {
          itemCode: "A",
          quantity: 0,
        };

        const res = await chai.request(app).post("/cart?cartId=1").send(newItem);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("cart");
        expect(res.body.cart).to.have.property("items");
        let exists = res.body.cart.items.find(
          (item: any) => item.itemCode === newItem.itemCode
        );
        expect(exists).to.be.undefined;

        const dbCartItems: any = await sequelize.query(
          `SELECT items FROM carts WHERE "id"=${res.body.cart.id}`
        );
        const itemsArray = dbCartItems[0][0].items;
        let existsSameInDB: any = itemsArray.find(
          (item: any) => item.itemCode === newItem.itemCode
        );
        expect(existsSameInDB).to.undefined;
      });
      it("should throw error for invalid item addition", async () => {
        const newItem = {
          itemCode: "E",
          quantity: 1,
        };

        const res = await chai
          .request(app)
          .post("/cart?cartId=1")
          .send(newItem);

        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(`Please select a valid item`);
      });
      it("should throw error cartId provide is not present in db", async () => {
        const newItem = {
          itemCode: "A",
          quantity: 1,
        };

        const res = await chai
          .request(app)
          .post("/cart?cartId=2")
          .send(newItem);

        expect(res).to.have.status(404);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(`cart with 2 is not found`);
      });
    });
    describe("GET /cart", () => {
      // adding some item to cart
      before(async () => {
        await Cart.update(
          {
            items: [...sampleCartItems],
          },
          {
            where: {
              id: 1,
            },
          }
        );
      });
      it("should fetch cart details and sent discounted total price", async () => {
        const res = await chai.request(app).get("/cart/1");
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.be.property("cart");
        expect(res.body.cart).to.have.property("cartItems");
        expect(res.body.cart).to.have.property("totalPrice");
        expect(res.body.cart.totalPrice).to.equal(155);
        expect(res.body.cart).to.have.property("totalDiscount");
        expect(res.body.cart.totalDiscount).to.equal(45);
      });
      it("should throw 404 error for cart is not present", async () => {
        const cartId = 2;
        const res = await chai.request(app).get(`/cart/${cartId}`);
        expect(res).to.have.status(404);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message");
        expect(res.body.message).to.equal(`cart with ${cartId} is not found`);
      });
    });

  });

  describe("Item Controller APIS", () => {
    describe("Get /item/getAll", () => {
      it("should fetch item details", (done) => {
        chai
          .request(app)
          .get("/item/getAll")
          .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an("object");
            expect(res.body).to.have.property("items");
            const itemExists = res.body.items.find((item: any) => item.code === sampleItem.code)
            expect(itemExists).to.exist;
            expect(itemExists?.code).to.equal(sampleItem.code);
            done();
          });
      });

      it("throw error when no items are there", async () => {

        // for clearing whole db since cannot delete items alone due to foreign key violation
        await sequelize.sync({ force: true });

        const response = await chai.request(app).get("/item/getAll");

        expect(response).to.have.status(404);
        expect(response.body).to.be.an("object");
        expect(response.body).to.have.property("message");
        expect(response.body.message).to.equal("currently no items present in db");
      });

      after(async () => {
        await sequelize.close();
      });

    })
  });
  describe('unknown API request',()=>{
    it("throw error when wrong route was hit", async () => {

  
      const response = await chai.request(app).get("/random");
  
      expect(response).to.have.status(404);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("message");
      expect(response.body.message).to.equal("Not found");
    });
  })
  

  after(async () => {
    await sequelize.close();
  });
})


