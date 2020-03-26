<template>
  <div class="container shadow-sm mb-5 light rounded"> 
    <div class="row">
      <div class="container d-flex justify-content-center">
        <h1>People by Postal Code</h1>
      </div>
    </div>
    <div class="container">
      <h4>Zip Code Lookup</h4>
      <span class="zip-buttons">
        <button v-for="(value, name, index) in C_zipSummary" @click.stop="DV_zipFilter = name">{{name}} - {{value.needers}} : {{value.careTakers}}</button>
        <button @click.stop="DV_zipFilter = ''" title="Clear filter">X</button>
        Zip code: <input v-model="DV_zipSearchQuery" /> <button name="search" @click.stop="fetchUsersList">Search</button>
      </span>
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
                      :value="needer._id" 
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
      DV_selectedNeeder: ""
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
      if (this.DV_zipFilter === "") {
        return this.DV_careTakersData
      }
      return this.DV_careTakersData.filter(item => item.ZipCode == vm.DV_zipFilter);
    },
    C_zipSummary() {
      let summary = {}
      let tmp;
      for (var index in this.DV_needersData) {
        tmp = this.DV_needersData[index].ZipCode;
        if(typeof summary[tmp] == "undefined") {
          summary[tmp] = {needers : 1, careTakers : 0};
        }
        else{
          summary[tmp].needers++;
        }
      }

      for( var index in this.DV_careTakersData) {
        tmp = this.DV_careTakersData[index].ZipCode;
        if(typeof summary[tmp] == "undefined") {
          summary[tmp] = {needers : 0, careTakers : 1};
        }
        else{
          summary[tmp].careTakers++;
        }
      }

      return summary;
    }
  },
  methods: {
    fetchUsersList() {
      var query = '';
      if(this.DV_zipSearchQuery) {
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
    removeUser(id, type) {
      alert("TODO");
    },
    formCluster() {
      alert("TODO");
    }
  }
}
</script>
