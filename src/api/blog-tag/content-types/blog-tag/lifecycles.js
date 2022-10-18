module.exports = {

    async beforeCreate(event) {

      const { result, params  } = event;
      return params.data.id_admin_user =  params.data.admin_user;       
        

  },
  async beforeUpdate(event) {
    const { result, params  } = event;
    return params.data.id_admin_user =  params.data.admin_user;       
  }

};