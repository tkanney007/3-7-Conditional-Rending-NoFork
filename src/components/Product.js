import { useState, useContext } from "react";
import { v4 as uuid } from "uuid";

import styles from "./Product.module.css";
import ViewList from "./ViewList";
import Card from "./Card";

import ProductContext from "../context/ProductContext";
import ModeContext from "../context/ModeContext";
import Toggle from "./Toggle";
import Button from "./Button";

function Product() {
  const ctx = useContext(ProductContext);
  const modeCtx = useContext(ModeContext);
  const [list, setList] = useState([]);
  const [sumTotal, setSumTotal] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [table, setTable] = useState(null);

  /*
    CREATE: Add a new product into the list
  */
  const handlerAddProduct = () => {
    const newItem = {
      id: uuid(),
      name: ctx.name,
      quantity: ctx.count,
      price: ctx.price,
      discount: ctx.discount,
      total: (ctx.count * ctx.price * (100 - ctx.discount)) / 100,
    };
    const newList = [...list, newItem];
    setList(newList);
    const sum = sumTotal + newItem.total;
    setSumTotal(sum);
  };

  /*
    DELETE a product from the list according to the given ID
  */
  const handlerDeleteProduct = (id) => {
    // Create a new item list with everything, except the item with matching ID
    const newList = list.filter((item) => item.id !== id);
    setList(newList);

    //Update new total
    let newTotal = 0;
    newList.forEach((item) => {
      newTotal += (item.quantity * item.price * (100 - item.discount)) / 100;
    });
    setSumTotal(newTotal);
  };
  const handlerEditItem = (id) => {
    console.log(id);
    let indx = list.findIndex((item) => item.id === id);
    const editTable = {
      index: indx,
      name: list[indx].name,
      quantity: list[indx].quantity,
      price: list[indx].price,
      discount: list[indx].discount,
    };

    setTable(editTable);
    setIsEdit(true);
  };

  const handlerUpdateForm = (e, key) => {
    const value = e.target.value;
    const updatedTable = { ...table, [key]: value };
    setTable(updatedTable);
  };

  const handlerSubmitForm = () => {
    const editedItem = { ...list[table.index] };
    editedItem.name = table.name;
    editedItem.quantity = table.quantity;
    editedItem.price = table.price;
    editedItem.discount = table.discount;
    editedItem.total =
      (table.quantity * table.price * (100 - table.discount)) / 100;

    const newList = [...list];
    newList[table.index] = editedItem;
    setList(newList);
    /************************************************/
    const updatedSum = sumTotal - list[table.index].total + editedItem.total;
    setSumTotal(updatedSum);

    setIsEdit(false);
  };

  //---------------------------------------------------------------------------

  return (
    <div className={`${styles.container} ${modeCtx.isDark && styles.dark}`}>
      <Toggle />
      <Card handlerAddProduct={handlerAddProduct} />
      <ViewList
        list={list}
        sum={sumTotal}
        handlerDeleteItem={handlerDeleteProduct}
        handlerEditItem={handlerEditItem}
        isEdit={isEdit}
      />
      {isEdit ? (
        <form className={styles.form} onSubmit={handlerSubmitForm}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Disc %</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    value={table.name}
                    type="text"
                    onChange={(e) => handlerUpdateForm(e, "name")}
                  />
                </td>
                <td>
                  <input
                    value={table.quantity}
                    type="number"
                    min={1}
                    onChange={(e) => handlerUpdateForm(e, "quantity")}
                  />
                </td>
                <td>
                  <input
                    value={table.price}
                    type="number"
                    min={0}
                    step={0.01}
                    onChange={(e) => handlerUpdateForm(e, "price")}
                  />
                </td>
                <td>
                  <input
                    value={table.discount}
                    type="number"
                    min={0}
                    onChange={(e) => handlerUpdateForm(e, "discount")}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <input type="submit" />
          <Button label="Cancel" onClick={() => setIsEdit(false)} />
        </form>
      ) : null}
    </div>
  );
}

export default Product;
