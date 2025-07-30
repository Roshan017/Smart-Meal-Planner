import api from "./api";

export const searchMeals = async (val) => {
  try {
    const res = await api.get('/meals/search-meals', {
      params: { title: val }   // backend expects "title"
    });
    console.log('Meals Fetched');
    return res;
  } catch (e) {
    console.error('Error fetching meal!', e);
    throw e;
  }
};

export const getMeal = async(id) =>{
    try{
        const res = await api.get(`/meals/${id}`);  
    console.log('Meal Details');
    return res;
       
    }
    catch(e){
        console.error(e);
        throw e
    }
}

export const addMeal = async (id) => {
  try {
    const res = await api.post(`/meals/add-meal?meal_id=${id}`);
    console.log('Meal Added');
    return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const deleteMeal = async(id) =>{
  try{

    const res = await api.delete(`/meals/remove-meal/${id}`)
    console.log('Meal Deleted');
    return res

  }catch(e){
     console.error(e);
      throw e;
  }
}