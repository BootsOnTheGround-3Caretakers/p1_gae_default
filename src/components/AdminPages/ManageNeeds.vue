<template>
  <div class="container mt-3 text-left">
    <h2>Needs Management</h2>
    <div class="row mt-3">
      <div class="col-md-12">
        <div class="d-flex justify-content-between mb-3">
          <h4>Available needs</h4>
          <button class="btn btn-primary">Add new Need</button>
        </div>
        <div class="table-responsive">
          <table id="mytable" class="table table-bordred table-striped">
            <thead>
              <th>Name</th>
              <th>Requirement</th>
              <th>Edit</th>
              <th>Delete</th>
            </thead>
            <tbody>
              <tr v-for="need in DV_needs">
                <td>{{need.name}}</td>
                <td>{{need.requirements}}</td>
                <td>
                  <p data-placement="top" title="Edit">
                    <button class="btn btn-primary btn-xs" >
                      <span class="glyphicon glyphicon-pencil"></span>
                    </button>
                  </p>
                </td>
                <td>
                  <p data-placement="top" title="Delete">
                    <button class="btn btn-danger btn-xs" >
                      <span class="glyphicon glyphicon-trash"></span>
                    </button>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        DV_needs: {}
      }
    },
    mounted() {
      this.DV_needs = window.vue_instance.$data.firebaseData.needsMetaData;
    }
  }
</script>