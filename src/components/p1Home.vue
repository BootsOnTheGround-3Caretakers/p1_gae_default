<template>
  <div class="container shadow-sm light rounded"> 
    <h3 class="text-left text-dark pt-3">At a Glance</h3>
    <div class="row box_shadow radius_5 ptb_2 flex_full text-center align-items-center">
      <div class="col border-right">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">Needers</p>
        <p class="mb-0 fs_35 ">{{DV_sampleData.NCMNM2.Needers}}</p>
      </div>
      <div class="col border-right">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">Caregivers</p>
        <p class="mb-0 fs_35 ">{{DV_sampleData.NCMNM2.Caregivers}}</p>
      </div>
      <div class="col border-right">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">Matches</p>
        <p class="mb-0 fs_35 ">{{DV_sampleData.NCMNM2.Matches}}</p>
      </div>
      <div class="col border-right">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">Needers Needing Matches</p>
        <p class="mb-0 fs_35 ">{{DV_sampleData.NCMNM2.NeedersNeedingMatches}}</p>
      </div>
      <div class="col">
        <p class="mb-0 font-weight-bold fs_20 f_smooth">Caregivers Needing Matches</p>
        <p class="mb-0 fs_35 ">{{DV_sampleData.NCMNM2.CaregiversNeedingMatches}}</p>
      </div>
    </div>
    <h4 class="text-left text-dark pt-5">Top #Hashtags</h4>
    <div class="row box_shadow radius_5 ptb_2 flex_full text-left">
      <div v-for="hashtag in DV_sampleData.top2Hashtags" class="col border-right">
        <span class="fs_20 text-primary pointer">#{{hashtag.tag}}<i class="ml-2 fas fa-external-link-alt"></i></span>
        <hr>
        <p v-for="(item, key) in hashtag.NCMNM2count">
          <b>{{key}}:</b> {{item}}
        </p>
      </div>
    </div>
    <h4 class="text-left text-dark pt-5">Top Locations</h4>
    <div class="row box_shadow radius_5 ptb_2 flex_full text-left">
      <div v-for="hashtag in DV_sampleData.top2Geos" class="col border-right">
        <span class="fs_20 text-primary pointer">{{hashtag.geo}}<i class="ml-2 fas fa-external-link-alt"></i></span>
        <hr>
        <p v-for="(item, key) in hashtag.NCMNM2count">
          <b>{{key}}:</b> {{item}}
        </p>
      </div>
    </div>
    <h4 class="text-left text-dark pt-5">Top Need-Skill</h4>
    <div class="row box_shadow radius_5 ptb_2 flex_full text-left mb-5">
      <div v-for="hashtag in DV_sampleData.top2NeedSkill" class="col border-right">
        <span class="fs_20 text-primary pointer">{{hashtag.needSkill}}<i class="ml-2 fas fa-external-link-alt"></i></span>
        <hr>
        <p v-for="(item, key) in hashtag.NCMNM2count">
          <b>{{key}}:</b> {{item}}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'p1Home',
    data () {
      return {
        DV_sampleData: {
          NCMNM2: { 
            Needers: 1999, 
            Caregivers: 7777,
            Matches: 1234,
            NeedersNeedingMatches:  1001,
            CaregiversNeedingMatches: 20202
          },
          top2Hashtags: [
            {
              tag: "Veteran",
              NCMNM2count: { 
                Needers: 505, 
                Caregivers: 504,
                Matches: 503,
                NeedersNeedingMatches:  502,
                CaregiversNeedingMatches: 501
              }
            },
            {
              tag: "DogOwners",
              NCMNM2count: { 
                Needers: 405, 
                Caregivers: 404,
                Matches: 403,
                NeedersNeedingMatches:  402,
                CaregiversNeedingMatches: 401
              }
            }
          ],
           top2Geos: [ 
            {
              geo: "Pakistan, Lahore 54000",
              NCMNM2count: { 
                Needers: 205, 
                Caregivers: 204,
                Matches: 203,
                NeedersNeedingMatches:  202,
                CaregiversNeedingMatches: 201
              }
            },
            {
              geo: "USA, New York 10096",  //replace with the correct format for geo.
              NCMNM2count: { 
                Needers: 105, 
                Caregivers: 104,
                Matches: 103,
                NeedersNeedingMatches:  102,
                CaregiversNeedingMatches: 101
              }
            }
          ],
          top2NeedSkill: [ 
            {
              needSkill: "GroceryDelivery",
              need_uid: "???", 
              skill_uid: "????",
              NCMNM2count: { 
                Needers: 75, 
                Caregivers: 74,
                Matches: 73,
                NeedersNeedingMatches:  72,
                CaregiversNeedingMatches: 71
              }
            },
            {
              needSkill: "GeneralSupportNearby",
              need_uid: "???", 
              skill_uid: "????",
              NCMNM2count: { 
                Needers: 65, 
                Caregivers: 64,
                Matches: 63,
                NeedersNeedingMatches:  62,
                CaregiversNeedingMatches: 61
              }
            }
          ]
        }
      } 
    }
  }
</script>
