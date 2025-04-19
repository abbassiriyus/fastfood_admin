import React from 'react';
import Categories from './Category';
import Maxdulot from './Maxsulot';

const AdminPanel = () => {
  const [categories, setCategories] = React.useState([]);

  return (
    <div>
      <h2>Kategoriyalar</h2>
      <Categories categories={categories} setCategories={setCategories} />
      <h2>Mahsulotlar</h2>
      <Maxdulot categories={categories} />
    </div>
  );
};

export default AdminPanel;