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
        <input class="rounded p-1" v-model="DV_apiFilters.ZipCode" placeholder="Search by zip code"/> 
        Hashtags: 
        <input class="rounded p-1" v-model="DV_apiFilters.Hashtags" placeholder="Search by Hashtags"/> 
        <button class="btn btn-info" name="search" @click.stop="fetchUsersList">Search</button>
      </div>
      <br />
      <br />
      <center>
        <button class="form-cluster" @click.stop="formCluster">Form Cluster</button>
      </center>
    </div>
    <br />
    <div>
      <div class="row">
        <div class="col-md-6 px-0">
          <h4>Needers {{C_filteredNeeders.length}} </h4>
          <div class="userListContainer">
            <table class="table table-hover table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th @click="DV_neederObj.setOrderBy('ZipCode')">Zip Code</th>
                  <th @click="DV_neederObj.setOrderBy('name')">User</th>
                  <th @click="DV_neederObj.setOrderBy('Description')">Needs</th>
                  <th @click="DV_neederObj.setOrderBy('Hashtags')">Tags</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="needer in C_filteredNeeders" :key="needer._id">
                  <td>
                    <input 
                      style="cursor: pointer;" 
                      type="radio" 
                      name="select_needer" 
                      v-model="DV_selectedNeeder"
                      :value="needer" 
                      :id="needer._id"
                    />
                  </td>
                  <td><label :for="needer._id">{{needer.ZipCode}}</label></td>
                  <td><a :href="`mailto:${needer.email}`">{{needer.name}}</a> ({{needer.RequestedClusterSize || 1}})</td>
                  <td><label :for="needer._id">{{needer.Description}}</label></td>
                  <td><label :for="needer._id">{{needer.Hashtags}}</label></td>
                  <td>
                    <button 
                      name="remove_user" 
                      @click.stop="removeUser(needer._id, 'needers')"
                      class="btn btn-danger"
                    >X</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="col-md-6 px-0">
          <h4>Care Takers {{C_filteredCareTakers.length}}</h4>
          <div class="userListContainer">
            <table class="table table-hover table-sm">
              <thead>
                <tr>
                  <th></th>
                  <th @click="DV_careTakerObj.setOrderBy('ZipCode')">Zip Code</th>
                  <th @click="DV_careTakerObj.setOrderBy('name')">User</th>
                  <th @click="DV_careTakerObj.setOrderBy('Description')">Provides</th>
                  <th @click="DV_careTakerObj.setOrderBy('Hashtags')">Tags</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="careTaker in C_filteredCareTakers" :key="careTaker._id">
                  <td>
                    <input 
                      style="cursor: pointer;" 
                      type="checkbox" 
                      name="select_care_taker" 
                      v-model="careTaker.selected" 
                      :value="careTaker._id" 
                      :id="careTaker._id"
                    />
                  </td>
                  <td><label :for="careTaker._id">{{careTaker.ZipCode}}</label></td>
                  <td><a :href="`mailto:${careTaker.email}`">{{careTaker.name}}</a> ({{careTaker.SlotCount || 1}})</td>
                  <td><label :for="careTaker._id">{{careTaker.Description}}</label></td>
                  <td><label :for="careTaker._id">{{careTaker.Hashtags}}</label></td>
                  <td>
                    <button 
                      name="remove_user" 
                      @click.stop="removeUser(careTaker._id, 'careTakers')"
                      class="btn btn-danger"
                    >X</button>
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
import AWN from "awesome-notifications";

export default {
  name: 'p1Home',
  data () {
    return {
      DV_apiHost: 'http://c29a9953.ngrok.io/api/v1/',
      DV_neederObj: {
        table: 'NeedersLookingForMatch',
        data: [],
        selected: '',
        zipFilter: '',
        orderBy: 'name',
        orderDir: 'asc',
        isFetching: false,
        setOrderBy: function(orderBy){
          this.orderBy = orderBy;
        },
        sort: function(field){
          if(field === this.orderBy)
            this.orderDir = this.orderDir==='asc'?'desc':'asc';
          this.orderBy = field;
        }
      },
      DV_careTakerObj: {
        table: 'CaretakersLookingForMatch',
        data: [],
        selected: '',
        zipFilter: '',
        orderBy: 'name',
        orderDir: 'asc',
        isFetching: false,
        setOrderBy: function(orderBy){
          this.orderBy = orderBy;
        },
        sort: function(field){
          if(field === this.orderBy)
            this.orderDir = this.orderDir==='asc'?'desc':'asc';
          this.orderBy = field;
        }
      },
      DV_clusterObj: {
        table: 'CaretakersLookingForMatch',
        data: [],
        selected: '',
        zipFilter: '',
        orderBy: 'name',
        orderDir: 'asc',
        isFetching: false,
        setOrderBy: function(orderBy){
          this.orderBy = orderBy;
        },
        sort: function(field){
          if(field === this.orderBy)
            this.orderDir = this.orderDir==='asc'?'desc':'asc';
          this.orderBy = field;
        }
      },
      DV_zipSearchQuery: "",
      DV_zipFilter: "",
      DV_selectedNeeder: null,
      DV_apiFilters: {
        ZipCode: "",
        Hashtags: ""
      },
      DV_zips: []
    }
  },
  mounted() {
    this.fetchUsersList();
  },
  computed: {
    C_filteredNeeders() {
      var vm = this;
      
      this.DV_neederObj.data = this.DV_neederObj.data.sort((a,b) => {
        let modifier = 1;
        if(this.DV_neederObj.orderDir === 'desc')
          modifier = -1;
        if(a[this.DV_neederObj.orderBy] < b[this.DV_neederObj.orderBy])
          return -1 * modifier;
        if(a[this.DV_neederObj.orderBy] > b[this.DV_neederObj.orderBy])
          return 1 * modifier;
        return 0;
      });
      
      if (this.DV_zipFilter === "") {
        return this.DV_neederObj.data;
      }

      return this.DV_neederObj.data.filter(item => item.ZipCode == vm.DV_zipFilter);
    },
    C_filteredCareTakers() {
      var vm = this;
      this.DV_careTakerObj.data = this.DV_careTakerObj.data.sort((a,b) => {
        let modifier = 1;
        if(this.DV_neederObj.orderDir === 'desc')
          modifier = -1;
        if(a[this.DV_neederObj.orderBy] < b[this.DV_neederObj.orderBy])
          return -1 * modifier;
        if(a[this.DV_neederObj.orderBy] > b[this.DV_neederObj.orderBy])
          return 1 * modifier;
        return 0;
      });
      var filtered_entries = this.DV_careTakerObj.data;

	  
      if (this.DV_zipFilter !== "") {
        filtered_entries = filtered_entries.filter(item => item.ZipCode === vm.DV_zipFilter);
      }
      else if (this.DV_careTakerObj.zipFilter !== "") {
        filtered_entries = filtered_entries.filter((item) => item.ZipCode === this.DV_careTakerObj.zipFilter);
      }
      return filtered_entries;
    },
    C_zipSummary() {
      let summary = {}
      let zip;
      if (this.DV_zips.length > 0)
        for (var i = 0; i < this.DV_zips.length; i++)
          summary[this.DV_zips[i]] = {needers: 0, careTakers: 0};
      
      for (var index in this.DV_neederObj.data) {
        zip = this.DV_neederObj.data[index].ZipCode;

        if (typeof summary[zip] == "undefined") {
          summary[zip] = {needers: 1, careTakers: 0};
          this.DV_zips.push(zip);
        } else{
          summary[zip].needers++;
        }
      }

      for ( var index in this.DV_careTakerObj.data) {
        zip = this.DV_careTakerObj.data[index].ZipCode;

        if (typeof summary[zip] == "undefined") {
          summary[zip] = {needers: 0, careTakers: 1};
          this.DV_zips.push(zip);
        } else {
          summary[zip].careTakers++;
        }
      }

      return summary;
    }
  },
  methods: {
    filtersToApiString(){
      if(typeof this.DV_apiFilters != "object" || Object.keys(this.DV_apiFilters).length < 1)
        return '';
      // Sample: http://c29a9953.ngrok.io/api/v1/NeedersLookingForMatch/?limit=50&query={"ZipCode":"19871","Hashtags":"MyHash"}
      var ret = '&query={';
      for(var key in this.DV_apiFilters){
        if(this.DV_apiFilters[key])
          if(key == 'Hashtags')
            ret += '"' + key + '":{"$regex":"' + this.DV_apiFilters[key] + '"},';
          else
            ret += '"' + key + '":"' + this.DV_apiFilters[key] + '",';
      }
      return ret.replace(/,$/, '') + '}';
   },
   filtersToClusteredApiString(){
        if(typeof this.DV_apiFilters != "object" || Object.keys(this.DV_apiFilters).length < 1)
          return '&query={"ClusterIsActive":{"$ne":false}}';
        // Sample: http://c29a9953.ngrok.io/api/v1/MatchedClusters/?limit=50&query={"ZipCodeCommon":"19871","HashtagsCommon":"MyHash","ClusterIsActive":{"$ne":false}}
        var ret = '&query={';
        for(var key in this.DV_apiFilters){
          if(this.DV_apiFilters[key])
            if(key == 'Hashtags')
              ret += '"HashtagsCommon":{"$regex":"' + this.DV_apiFilters[key] + '"},';
            else if(key == 'ZipCode')
              ret += '"ZipCodeCommon":"' + this.DV_apiFilters[key] + '",';
        }
        ret += '"ClusterIsActive":{"$ne":false}}'
        return ret;
    },
    fetchUsersList() {
      var query = '?';
      query += this.filtersToApiString();

      // Fetch DV_neederObj.data
      http.get(this.DV_apiHost + this.DV_neederObj.table + query)
        .then((response) => {
          this.DV_neederObj.data = response.data;
        }).catch((error) => {
          console.log(error);
        })

      // Fetch DV_careTakerObj.data
      http.get(this.DV_apiHost + this.DV_careTakerObj.table + query)
        .then((response) => {
          this.DV_careTakerObj.data = response.data;
        }).catch((error) => {
          console.log(error);
        })
    },
    removeUser(user_uid, type) {
      if (type === "needers") {
        http.delete(this.DV_apiHost + this.DV_neederObj.table + '/' + user_uid)
        .then((response) => {
          let index = this.DV_neederObj.data.findIndex((item) => {
            return item._id === user_uid;
          });

          if (index !== undefined) {
            this.DV_neederObj.data.splice(index, 1);
          }
          this.$awn.success("Needer User was removed successfully.");
        }).catch((error) => {
          this.$awn.warning("There was an issue while removing the Needer User.");
          console.log(error);
        });
      }
      else if (type === "careTakers") {
        http.delete(this.DV_apiHost + this.DV_careTakerObj.table + '/' + user_uid)
        .then((response) => {
          let index = this.DV_careTakerObj.data.findIndex((item) => {
            return item._id === user_uid;
          });
          
          if (index !== undefined) {
            this.DV_careTakerObj.data.splice(index, 1);
          }
          this.$awn.success("Care Taker was removed successfully.");
        }).catch((error) => {
          this.$awn.warning("There was an issue while removing the Care Taker.");
          console.log(error);
        });
      }
    },
    formCluster() {
      let vm = this;

      if (!this.DV_neederObj.selected) {
        this.$awn.warning("Please select a needer before creating Cluster.");
        return;
      }
      
      let selected_care_takers = this.C_filteredCareTakers.filter((item) => item.selected)
      if (selected_care_takers.length === 0) {
        this.$awn.warning("Please select careTakers before creating Cluster");
        return;
      }
      
      if (selected_care_takers.length > 10) {
        this.$awn.warning('Care takers cannot exceed 10');
        return;
      }

      let extraJsonObj = [];
      extraJsonObj.push(this.DV_neederObj.selected);

      let data = {
        NeederEmail : this.DV_neederObj.selected.email,
        ZipCodeCommon : this.DV_neederObj.selected.ZipCode,
        ClusterIsActive : true,
        HashtagsCommon : this.DV_neederObj.selected.Hashtags
      }

      for (let index in selected_care_takers) {
        let care_taker = selected_care_takers[index];

        let prop_name = `Caretaker${++index}Email`;
        data[prop_name] = care_taker.email;
        extraJsonObj.push(care_taker);
      }
      data['ExtraJSONstrings'] = JSON.stringify(extraJsonObj);

      http.post(this.DV_apiHost + this.DV_clusterObj.table, data)
      .then((response) => {
        this.$awn.success("Cluster formed successfully.");
      }, (error) => {
        this.$awn.warning("There was an issue while creating this Cluster.");
        console.log(error);
      });

      // Delete the selected records
      this.removeUser(this.DV_neederObj.selected._id, 'needers');
      this.DV_neederObj.selected = null;

      for (var index = 0; index < selected_care_takers.length; index++) {
        this.removeUser(selected_care_takers[index]._id, 'careTakers');
      }
    }
  },
  watch: {
    DV_selectedNeeder(val) {
      this.DV_careTakerObj.zipFilter = val.ZipCode;
    }
  }
}
</script>
