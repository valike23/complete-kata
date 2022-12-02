<script >
    import axios from "axios";
    import { onMount } from "svelte";
    let socket,win;
    let pool = {};
    let athletes = [];
    let athlete = {};
    athlete.result = 0;
    athlete.club ={};
    let kata = '';
    athlete.category = {};
    let show = "";
    onMount(() => {
      win = window;
      console.log(window);
      socket = win.io("/display");
      socket.on("connect", () => {
        console.log(socket.id);
      });
      socket.on("update", (data) => {});
      socket.on("display athlete", async (data) => {
        console.log("display");
        show = "athlete";
        console.log(data);
        kata = data.kata;
        athlete = data.activeAthlete;
        athlete.result = 0;
        athlete.club = {};
        athlete.category = {};
        try {
          let response = await axios.get(
            `api/athlete?id=${data.activeAthlete.id}&status=single`
          );
          console.log(response.data);
          athlete = response.data;
          athlete = athlete;
          athlete.result = 0;
        } catch (error) {}
      });
      socket.on("active pool", async (mypool) => {
        show = "pool";
        pool = mypool;
        try {
          athletes = (
            await (
              await axios.get(`api/pool_athlete?id=${mypool.id}`)
            ).data
          ).athletes;
          console.log(athletes);
          athletes = athletes;
        } catch (error) {
        }
      });
      socket.on("result",(result)=>{
        athlete.result = result;
      })
    });
  </script>
  
  {#if show == "pool"}
    <div>
      <h3>Current Pool {pool.pool_name}</h3>
    </div>
    <div class="row p-4">
      <div class="col-12 ">
        <div class="card">
          <div class="table-responsive">
            <table class="table align-items-center mb-0">
              <thead>
                <tr>
                  <th
                    class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >id</th
                  >
                  <th
                    class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >name</th
                  >
  
                  <th
                    class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                    >result</th
                  >
                </tr>
              </thead>
              <tbody>
                {#each athletes as a, i}
                  <tr>
                    <td class="align-middle text-center text-black text-sm">
                      <p>{i + 1}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p>{a.first_name + " " + a.last_name}</p>
                    </td>
                    <td class="align-middle text-center text-sm">
                      <p>{a.result || 0}</p>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  {:else if show == "athlete"}
  <div class="container" style="background-color: black;">
    <div class="text-center justify-content-center row">
      <div class="col-8">
        <br />
        <!-- svelte-ignore a11y-missing-content -->
        <h1 class="text-uppercase" style="color: red; font-weight: 800;" />
      </div>
    </div>
    <div class="p-3 row">
      <div class="col-5">
        <div
          class="justify-content-center text-center p-4 font-weight-bolder"
          style="background-color: yellow; color: red; height: 230px;"
        >
          <h1 style="font-size: 130px; font-weight: 800;">{(athlete.result).toFixed(2) || 0.00}</h1>
          <p
            class="float-right text-center align-self-end h2 font-weight-bolder p-4 mr-0"
            style="background-color: transparent; color: yellow; font-size: 50px;"
          >
            1
          </p>
        </div>
      </div>
      <div
        class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
      >
        <span class="font-size-18">0.7 TECHNICAL</span>&nbsp;&nbsp;<span
          class="font-size-18">0.3 ATHLETIC</span
        >
      </div>
      <div class="col-2" />
    </div>
    <br />
    <div class="text-center justify-content-center row">
      <div class="text-center col-8">
        <h1 class="text-uppercase" style="color: red; font-size: 40px;" >{athlete.category.category_name}</h1>
      </div>
    </div>
    <br />
    <div class="p-4 row">
      <div class="col-4">
        <div class="pl-4" style="border-left: 1px solid red;">
          <h1 style="color: white; font-size:x-large" >{athlete.first_name + ' ' + athlete.last_name}</h1>
        </div>
      </div>
      <div class="col-4">
        <img
          class="img-fluid"
          src="{athlete.club.flag}"
          alt="state-flag"
          width="500"
        />
      </div>
      <div class="col-4">
        <div class="pr-4 text-right" style="border-right: 1px solid red;">
          <h1 style="color: white;" >{kata}</h1>
        </div>
      </div>
    </div>
    <br />
  </div>
    
  {:else}
    <div class="container" style="background-color: black;">
      <div class="text-center justify-content-center row">
        <div class="col-8">
          <br />
          <!-- svelte-ignore a11y-missing-content -->
          <h1 class="text-uppercase" style="color: red; font-weight: 800;" />
        </div>
      </div>
      <div class="p-3 row">
        <div class="col-5">
          <div
            class="justify-content-center text-center p-4 font-weight-bolder"
            style="background-color: yellow; color: red; height: 230px;"
          >
            <h1 style="font-size: 130px; font-weight: 800;">0.00</h1>
            <p
              class="float-right text-center align-self-end h1 font-weight-bolder p-4 mr-0"
              style="background-color: red; color: yellow; font-size: 50px;"
            >
              1
            </p>
          </div>
        </div>
        <div
          class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
        >
          <span class="font-size-18">0.7 TECHNICAL</span>&nbsp;&nbsp;<span
            class="font-size-18">0.3 ATHLETIC</span
          >
        </div>
        <div class="col-2" />
      </div>
      <br />
      <div class="text-center justify-content-center row">
        <div class="text-center col-8">
          <!-- svelte-ignore a11y-missing-content -->
          <h1 class="text-uppercase" style="color: red; font-size: 40px;" />
        </div>
      </div>
      <br />
      <div class="p-4 row">
        <div class="col-4">
          <div class="pl-4" style="border-left: 1px solid red;">
            <!-- svelte-ignore a11y-missing-content -->
            <h1 style="color: white;" />
          </div>
        </div>
        <div class="col-4">
          <img
            class="img-fluid"
            src="sports.png"
            alt="state-flag"
            width="500"
          />
        </div>
        <div class="col-4">
          <div class="pr-4 text-right" style="border-right: 1px solid red;">
            <!-- svelte-ignore a11y-missing-content -->
            <h1 style="color: white;" />
          </div>
        </div>
      </div>
      <br />
    </div>
  {/if}
  
  <style>
    .box {
      margin-top: 10%;
    }
    .category {
      font-size: 2 rem;
      color: white;
      font-weight: 600;
    }
  </style>