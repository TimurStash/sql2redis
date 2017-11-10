export default obj => {
    let copy = {...obj};
    for(const key in copy){
        if(copy.hasOwnProperty(key)){
            copy[key] = copy[key] || '';
        }
    }
    return copy;
}