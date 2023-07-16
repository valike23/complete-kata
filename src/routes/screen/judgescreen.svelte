<script>
  import axios from "axios";
  import { onMount } from "svelte";
  let scores = 7.0;

  let judge = {};
  let socket;
  let isLogged = false;
  let screen = "";
  let pool = {};
  let disqualified = async () => {
    let res = confirm("do you want to disqualify this athlete?");
    if(res) await uploadScore(0);
  };
  const submitScore = async () => {
    let res = confirm("do you want to upload this athlete's score?");
    scores = Number(document.getElementById("scores").value);
    if (scores == 0) {
      await disqualified();
      return;
    }

    console.log(scores);
    await uploadScore(scores);
  };

  const uploadScore = async (scores) => {
    try {
      const res = confirm("Do you want disqualify this athlete?");
      if (res) {
        let judgeResult = {
          entryId: athlete.id,
          RESULT: scores,
          judgeId: judge.id,
          poolId: pool.id,
        };
        console.log(judgeResult);
        let form = new FormData();
        form.append("judge", JSON.stringify(judgeResult));
        let data = await (await axios.post(`api/judges/pool`, form)).data;
        if (data) {
          let resd = await win.Swal.fire({
            icon: "success",
            title: "Success",
            text: "scores uploaded successfully",
          });
          if (resd) {
            socket.emit("judge scores", judgeResult);
            scores = 7.0;
            screen = "";
          }
        }
      }
    } catch (error) {
      console.error(error);
      win.Swal.fire({
        icon: "error",
        title: "oops!!!",
        text: "something went wrong...., please contact support.",
      });
    }
  };
  const reset = () => {
    scores = 7.0;
  };
  let athlete;
  let win;
  onMount(() => {
    win = window;

    socket = win.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("start judge", async (data) => {
      athlete = data.athlete;
      console.log("start judge data:", data);

      athlete.club = {};
      pool = data.pool;
      screen = "judge";

      setTimeout(() => {
        let ap = document.getElementById("scores");
        console.log(ap);
        win.$(ap).on("plusClick", (e) => {
          console.log(e.detail);
          let input = Metro.getPlugin(ap, "spinner");
          if (input.val() < 5) input.val(5);
        });
        win.$(ap).on("minusClick", (e) => {
          let input = Metro.getPlugin(ap, "spinner");
          if (input.val() < 5) input.val(0);
        });
      }, 3000);
      // try {
      //   let response = await axios.get(
      //     `api/athlete?id=${athlete.id}&status=single`
      //   );

      //   console.log(data);
      //   athlete = response.data;
      // } catch (error) {}
    });
    let userString = sessionStorage.getItem("kataUser");
    if (userString == undefined) {
      isLogged = false;
    } else {
      isLogged = true;
      judge = JSON.parse(userString);
    }
  });
  const login = async () => {
    try {
      let form = new FormData();
      let data = {
        name: judge.judgeName,
        password: judge.password,
      };
      form.append("body", JSON.stringify(data));
      let response = await axios.put(`api/judges`, form);
      if (response.data != null) {
        let res = await win.Swal.fire({
          icon: "success",
          title: "Success",
          text: "login was successful",
        });
        if (res) {
          console.log("sepecial users");
          sessionStorage.setItem("kataUser", JSON.stringify(response.data));
          //handle here
          isLogged = true;
          judge = response.data;
        }
      } else {
        win.Swal.fire({
          icon: "error",
          title: "error",
          text: "user name or password incorrect",
        });
      }
    } catch (error) {
      console.error(error);
      win.Swal.fire({
        icon: "error",
        title: "oops!!!",
        text: "something went wrong...., please contact support.",
      });
    }
  };
</script>

<div class="container-fluid">
  {#if isLogged}
    {#if screen == "judge"}
      <div class="container" style="background-color: black;">
        <div class="p-3 row">
          <div class="cell-5">
            <div
              class="justify-content-center text-center p-4 font-weight-bolder"
              style="background-color: yellow; color: red;"
            >
              <h1 style="font-size: 36px; font-weight: 800;">
                {judge.judgeName}
              </h1>
            </div>
          </div>
          <div
            class="justify-content-end text-center pt-4 text-white font-weight-bolder cell-5"
          >
            <span class="font-size-18"> RESULT</span>&nbsp;&nbsp;
          </div>
          <div class="cell-2">
            <button class="btn btn-warning btn-block btn btn-secondary"
              >Logout</button
            >
          </div>
        </div>
        <br />
        <div class="text-center justify-content-center row">
          <div class="cell-4">
            <h1 class="text-uppercase" style="color: red;">{pool.poolName}</h1>
          </div>
        </div>
        <br />
        <div class="p-4 row">
          <div class="cell-4">
            <div class="pl-4" style="border-left: 1px solid red;">
              <h1>{athlete.name}</h1>
            </div>
          </div>
          <div class="cell-4">
            <img
              class="img-fluid"
              src={athlete.club.flag}
              alt="state-flag"
              width="500"
            />
          </div>
          <div class="cell-4">
            <div class="pr-4 text-right" style="border-right: 1px solid red;">
              <h1 />
            </div>
          </div>
        </div>
        <br />
        <div class="mx-5 row">
          <div class="p-4 col">
            <div class="row">
              <div
                class="p-2 cell-12 cell-sm-12"
                style="border-right: 1px solid red;"
              >
                <label
                  class="font-weight-bold h1"
                  for="tech"
                  style="color: white;"
                  >Scores
                </label>&nbsp;&nbsp;

                <input
                  style="background-color: white;"
                  class="font-weight-bold text-right"
                  type="text"
                  data-role="spinner"
                  data-min-value="0"
                  data-max-value="10"
                  id="scores"
                  bind:value={scores}
                  data-step=".1"
                  data-fixed="1"
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="text-center justify-content-center row">
          <div class="cell-4">
            <button
              type="button"
              on:click={submitScore}
              class="btn btn-warning btn-block btn-lg btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Submit Score</button
            >&nbsp;&nbsp;
          </div>
          <div class="cell-4 text-center">
            <button
              type="button"
              on:click={reset}
              class="btn btn-warning btn-block btn-lg btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Reset</button
            >&nbsp;&nbsp;
          </div>
          <div class="float-right cell-4">
            <button
              type="button"
              on:click={disqualified}
              class="btn btn-danger btn-block btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Dis-qualify</button
            >
          </div>
        </div>
        <br />
      </div>
    {:else}
      <div class="container" style="background-color: black;">
        <div class="p-3 row">
          <div class="col-5">
            <div
              class="justify-content-center text-center p-4 font-weight-bolder"
              style="background-color: yellow; color: red;"
            >
              <h1 style="font-size: 36px; font-weight: 800;">
                {judge.judgeName}
              </h1>
            </div>
          </div>
          <div
            class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
          >
            <span class="font-size-18">SCORES</span>&nbsp;&nbsp;
          </div>
          <div class="col-2">
            <button class="btn btn-warning btn-block btn btn-secondary"
              >Logout</button
            >
          </div>
        </div>
        <br />
        <div class="text-center justify-content-center row">
          <div class="col-4">
            <h1 class="text-uppercase" style="color: red;" />
          </div>
        </div>
        <br />
        <div class="p-4 row">
          <div class="col-4">
            <div class="pl-4" style="border-left: 1px solid red;"><h1 /></div>
          </div>
          <div class="col-4">
            <img
              class="img-fluid"
              src="images/HAWKtm.png"
              alt="state-flag"
              width="500"
            />
          </div>
          <div class="col-4">
            <div class="pr-4 text-right" style="border-right: 1px solid red;">
              <h1 />
            </div>
          </div>
        </div>
        <br />
        <div class="mx-5 row">
          <div class="p-4 col">
            <div class="row">
              <div class="p-2 col-12" style="border-right: 1px solid red;">
                <label
                  class="font-weight-bold h1"
                  for="tech"
                  style="color: white;">SCORES 0</label
                >&nbsp;&nbsp;<input
                  min="0.0"
                  max="10.0"
                  disabled
                  step="0.1"
                  id="technique"
                  name="technique"
                  placeholder="0.0"
                  class="form-control font-weight-bold"
                  type="number"
                  value="0"
                  style="border: 1px solid red; background-color: transparent; font-size: 28px; color: white;"
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div class="text-center justify-content-center row">
          <div class="col-4">
            <button
              type="button"
              class="btn btn-warning btn-block btn-lg btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Submit Score</button
            >&nbsp;&nbsp;
          </div>
          <div class="col-4">
            <button
              type="button"
              class="btn btn-warning btn-block btn-lg btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Reset</button
            >&nbsp;&nbsp;
          </div>
          <div class="float-right col-4">
            <button
              type="button"
              class="btn btn-danger btn-block btn btn-secondary"
              style="height: 70px; font-size: 18px; font-weight: 600;"
              >Disqualify</button
            >
          </div>
        </div>
        <br />
      </div>
    {/if}
  {:else}
    <div class="container">
      <div class="row">
        <div class="cell-12 centered">
          <form on:submit|preventDefault={login} class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Login Judge</h5>
            </div>
            <div class="modal-body">
              <div>Please login to continue</div>
              <div class="cell-12 cell-sm-6">
                <div class="form-group">
                  <label for="name">Nick Name</label>
                  <input
                    bind:value={judge.judgeName}
                    required
                    data-role="input"
                    class="form-control"
                    type="text"
                  />
                </div>
              </div>
              <div class="cell-12 cell-sm-6">
                <div class="form-group">
                  <label for="name">password </label>
                  <input
                    bind:value={judge.password}
                    required
                    data-role="input"
                    class="form-control"
                    type="password"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <input type="submit" class="button primary" />
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .centered {
    margin-left: auto;
    margin-top: auto;
    margin-right: auto;
    padding-right: auto;
  }
  .bold-text {
    margin-top: auto;
    font-size: 1.3 rem;
    font-weight: 600;
  }
  .form-control {
    border: 1px solid gray;
  }
  .input {
    width: 90%;
    height: 70px;
    font-size: 20px;
    font-weight: 700;
    border-radius: 12px;
    border: 2px solid blue;
    text-align: center;
  }
  p {
    font-size: 1.2rem;
    font-weight: 500;
  }
  @media only screen and (max-width: 600px) {
    .input-container {
      width: 80vw;
      margin: auto;
    }
  }
  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (min-width: 600px) {
    .input-container {
      width: 70vw;
      margin: auto;
    }
  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    .input-container {
      width: 60vw;
      margin: auto;
    }
  }
  /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    .input-container {
      width: 50vw;
      margin: auto;
    }
  }
  /* Extra large devices (large laptops and desktops, 1200px and up) */
  @media only screen and (min-width: 1200px) {
    .input-container {
      width: 50vw;
      margin: auto;
    }
  }
</style>
