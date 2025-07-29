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
        const res = await api.get(`/meals/${id}`);  // use path param
    console.log('Meal Details');
    return res;
       
    }
    catch(e){
        console.error(e);
        throw e
    }
}