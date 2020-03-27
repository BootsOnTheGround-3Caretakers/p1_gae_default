<template>
  <div class="container shadow-sm mb-5 light rounded"> 
    <div class="row">
      <div class="container d-flex justify-content-center">
        <h1>People by Postal Code</h1>
      </div>
    </div>
    <div v-if="Object.keys(C_zipSummary).length > 0" class="container">
      <h4>Zip Code Lookup</h4>
      <div class="zip-buttons">
        <button 
          class="btn zip-summary-button" 
          :class="{'active': DV_zipFilter === name}" 
          v-for="(value, name, index) in C_zipSummary" 
          @click.stop="DV_zipFilter = name"
        >{{name}} - {{value.needers}} : {{value.careTakers}}</button>

        <button 
          class="btn btn-danger" 
          @click.stop="DV_zipFilter = ''" 
          title="Clear filter"
        >X</button>
      </div>
      <div class="mt-3">
        Zip code: 
        <input class="rounded p-1" v-model="DV_zipSearchQuery" placeholder="Search by zip code"/> 
        <button class="btn btn-info" name="search" @click.stop="fetchUsersList">Search</button>
      </div>
      <br />
      <br />
      <center>
        <button class="form-cluster" @click.stop="formCluster">Form Cluster</button>
      </center>
    </div>
    <br />
    <div class="container">
      <div class="row">
        <div class="success-message">{{DV_successMessage}}</div>
      </div>
      <div class="row pl-4 pr-4">
        <div class="col-md">
          <h4>Needers {{C_filteredNeeders.length}} </h4>
          <div class="userListContainer">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Zip Code</th>
                  <th>User</th>
                  <th>Needs</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="needer in C_filteredNeeders" :key="needer._id">
                  <td>
                    <input 
                      type="radio" 
                      name="select_needer" 
                      v-model="DV_selectedNeeder"
                      :value="needer" 
                    />
                  </td>
                  <td>{{needer.ZipCode}}</td>
                  <td><a :href="`mailto:${needer.email}`">{{needer.name}}</a></td>
                  <td>{{needer.Description}}</td>
                  <td>
                    <button 
                      name="remove_user" 
                      @click.stop="removeUser(needer._id, 'needers')"
                    >Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-md">
          <h4>Care Takers {{C_filteredCareTakers.length}}</h4>
          <div class="userListContainer">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th>Zip Code</th>
                  <th>User</th>
                  <th>Provides</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="careTaker in C_filteredCareTakers" :key="careTaker._id">
                  <td>
                    <input 
                      type="checkbox" 
                      name="select_care_taker" 
                      v-model="careTaker.selected" 
                      :value="careTaker._id" 
                    />
                  </td>
                  <td>{{careTaker.ZipCode}}</td>
                  <td><a :href="`mailto:${careTaker.email}`">{{careTaker.name}}</a></td>
                  <td>{{careTaker.Description}}</td>
                  <td>
                    <button 
                      name="remove_user" 
                      @click.stop="removeUser(careTaker._id, 'careTakers')"
                    >Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from 'axios'

export default {
  name: 'p1Home',
  data () {
    return {
      DV_apiHost: 'http://c29a9953.ngrok.io/api/v1/',
      DV_neederTable: 'NeedersLookingForMatch',
      DV_careTakerTable: 'CaretakersLookingForMatch',
      DV_matchedClustersTable: 'MatchedClusters',
      DV_zipSearchQuery: "",
      DV_zipFilter: "",
      DV_needersData: [],
      DV_careTakersData: [],
      DV_successMessage: "",
      DV_selectedNeeder: null,
      DV_careTakerZipFilter: ""
    }
  },
  mounted() {
    this.fetchUsersList();
  },
  computed: {
    C_filteredNeeders() {
      var vm = this;
      if (this.DV_zipFilter === "") {
        return this.DV_needersData;
      }

      return this.DV_needersData.filter(item => item.ZipCode == vm.DV_zipFilter);
    },
    C_filteredCareTakers() {
      var vm = this;
      var filtered_entries = this.DV_careTakersData;

      if (this.DV_zipFilter === "" && this.DV_careTakerZipFilter === "") {
        return filtered_entries;
      }

      if (this.DV_zipFilter !== "") {
        filtered_entries = filtered_entries.filter(item => item.ZipCode === vm.DV_zipFilter);
      }
      
      if (this.DV_careTakerZipFilter !== "") {
        filtered_entries = filtered_entries.filter((item) => item.ZipCode === this.DV_careTakerZipFilter);
      }
      return filtered_entries;
    },
    C_zipSummary() {
      let summary = {}
      let zip;
      for (var index in this.DV_needersData) {
        zip = this.DV_needersData[index].ZipCode;

        if (typeof summary[zip] == "undefined") {
          summary[zip] = {needers : 1, careTakers : 0};
        } else{
          summary[zip].needers++;
        }
      }

      for ( var index in this.DV_careTakersData) {
        zip = this.DV_careTakersData[index].ZipCode;

        if (typeof summary[zip] == "undefined") {
          summary[zip] = {needers : 0, careTakers : 1};
        } else {
          summary[zip].careTakers++;
        }
      }

      return summary;
    }
  },
  methods: {
    fetchUsersList() {
      var query = '';
      if (this.DV_zipSearchQuery) {
        query = `?query=%7B%22ZipCode%22:%22${this.DV_zipSearchQuery}%22%7D`;
      }

      // Fetch DV_needersData
      http.get(this.DV_apiHost + this.DV_neederTable + query)
        .then((response) => {
          this.DV_needersData = response.data;
        }).catch((error) => {
          console.log(error);
        })

      // Fetch DV_careTakersData
      http.get(this.DV_apiHost + this.DV_careTakerTable + query)
        .then((response) => {
          this.DV_careTakersData = response.data;
        }).catch((error) => {
          console.log(error);
        })
    },
    removeUser(user_uid, type) {
      if (type === "needers") {
        http.delete(this.DV_apiHost + this.DV_neederTable + '/' + user_uid)
        .then((response) => {
          let index = this.DV_needersData.findIndex((item) => {
            return item._id === user_uid;
          });

          if (index !== undefined) {
            this.DV_needersData.splice(index, 1);
          }
        }).catch((error) => {
          console.log(error);
        });
      }
      else if (type === "careTakers") {
        http.delete(this.DV_apiHost + this.DV_careTakerTable + '/' + user_uid)
        .then((response) => {
          let index = this.DV_careTakersData.findIndex((item) => {
            return item._id === user_uid;
          });
          
          if (index !== undefined) {
            this.DV_careTakersData.splice(index, 1);
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    },
    formCluster() {
      let vm = this;

      if (this.DV_selectedNeeder === null || this.DV_selectedNeeder === undefined) {
        alert("Please select a needer before creating Cluster");
        return;
      }
      
      let selected_care_takers = this.C_filteredCareTakers.filter((item) => item.selected)
      if (selected_care_takers.length === 0) {
        alert("Please select careTakers before creating Cluster");
        return;
      }
      
      if (selected_care_takers.length > 10) {
        alert('Care takers cannot exceed 10');
        return false;
      }

      let extraJsonObj = [];
      extraJsonObj.push(this.DV_selectedNeeder);

      let data = {
        NeederEmail : this.DV_selectedNeeder.email,
        ZipCodeCommon : this.DV_selectedNeeder.ZipCode
      }

      for (let index in selected_care_takers) {
        let care_taker = selected_care_takers[index];

        let prop_name = `Caretaker${++index}Email`;
        data[prop_name] = care_taker.email;
        extraJsonObj.push(care_taker);
      }
      data['ExtraJSONstrings'] = JSON.stringify(extraJsonObj);

      http.post(this.DV_apiHost + this.DV_matchedClustersTable, data)
      .then((response) => {
        console.log("formCluster returned");
      }, (error) => {
        console.log(error);
      });

      // Delete the selected records
      this.removeUser(this.DV_selectedNeeder._id, 'needers');
      this.DV_selectedNeeder = null;

      for (var index = 0; index < selected_care_takers.length; index++) {
        this.removeUser(selected_care_takers[index]._id, 'careTakers');
      }
    }
  },
  watch: {
    DV_selectedNeeder() {
      if (this.DV_selectedNeeder !== null && this.DV_selectedNeeder !== undefined) {
        this.DV_careTakerZipFilter = this.DV_selectedNeeder.ZipCode;
      } else {
        this.DV_careTakerZipFilter = "";
      }
    }
  }
}
</script>
