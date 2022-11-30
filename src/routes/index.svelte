<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        const res = await this.fetch(`api/dashboard`);
        const dashboard = await res.json();
		console.log('my dashboard', dashboard);
        return { dashboard };
    }
</script>

<script >
	import {goto} from "@sapper/app";
	export let dashboard;
	
	const nav =(page)=>{
		goto(page)
	}
	
</script>
<svelte:head>
	<script defer src="js/dashboard.js"></script>
</svelte:head>
<div class="container-fluid start-screen h-100">
	<h1 class="start-screen-title">KATA project</h1>

	<div class="tiles-area clear">
		<div
			class="tiles-grid tiles-group size-2 fg-white"
			data-group-title="General"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				on:click={() => {
					nav("competition");
				}}
				data-role="tile"
				class="bg-orange fg-white"
				data-size="wide"
			>
				<span class="mif-chrome icon" />
				<span class="branding-bar">Manage Competition</span>
				<span class="badge-bottom">{dashboard.competitions}</span>
			</div>
			<a
				href="/categories"
				data-role="tile"
				data-size="wide"
				class="bg-indigo fg-white"
			>
				<span class="mif-github icon" />
				<span class="branding-bar">Categories</span>
				<span class="badge-bottom">30</span>
			</a>
		

		
			<a href="/clubs" data-role="tile" class="bg-cyan fg-white">
				<span class="mif-flag icon" />
				<span class="branding-bar">Clubs</span>
			</a>
			
			<a href="/entries" data-role="tile" class="bg-cyan fg-white">
				<span class="mif-table icon" />
				<span class="branding-bar">Entries</span>
			</a>
		</div>

		<div
			class="tiles-grid tiles-group size-2 fg-white"
			data-group-title="competition Manager"
		>
			<a href="/pools" data-role="tile" data-size="wide" data-cover="images/kata.jpg">
				<span class="branding-bar">Pools</span>
			</a>
			
			<a
			href="competition_controller"
				data-role="tile"
				data-size="wide"
			>
			<span class="mif-gamepad icon" />
				<span class="branding-bar">Competition Control</span>
		</a>
			<div data-role="tile" data-size="wide" data-effect="image-set">
				<img src="images/kata.jpg" />
				<img src="images/kata2.jpeg" />
				<img src="images/HAWKtm.png" />
				<img src="../../images/jolie.jpg" />
				<img src="../../images/jek_vorobey.jpg" />
			</div>
		</div>

		<div
			class="tiles-grid tiles-group size-1 fg-white"
			data-group-title="configuration"
		>
		<a href="/kata" data-role="tile" class="bg-red fg-white">
			<span class="mif-accessible icon" />
			<span class="branding-bar">Manage Kata</span>
		</a>
		</div>

		<div
			class="tiles-grid tiles-group size-2 fg-white"
			data-group-title="Others"
		>
		<a href="/judges" data-role="tile" class="bg-red fg-white">
			<span class="mif-balance-scale icon" />
			<span class="branding-bar">Manage Judges</span>
		</a>
			<div data-role="tile" class="bg-green">
				<img src="../../images/x-box.png" class="icon" />
				<span class="branding-bar">XBOX ONE</span>
			</div>
			<div
				data-role="tile"
				data-size="wide"
				data-cover="../../images/x-box.png"
			>
				<span class="branding-bar">XBOX LIVE</span>
				<span class="badge-top">5</span>
			</div>
		</div>
	</div>
</div>

<style>
	.start-screen {
		min-width: 100%;
		height: 100%;
		position: relative;
		padding-bottom: 20px;
	}
	.start-screen-title {
		position: fixed;
		top: 20px;
		left: 80px;
		display: none;
	}
	[class*="tile-"] {
		-webkit-transform: scale(0.8);
		-ms-transform: scale(0.8);
		transform: scale(0.8);
	}
	.tiles-group {
		margin-left: 0;
		margin-top: 50px;
	}
	@media all and (min-width: 768px) {
		.start-screen-title {
			display: block;
		}
		.start-screen {
			padding: 140px 80px 0 0;
		}
		.tiles-group {
			left: 100px;
		}
		.tiles-group {
			margin-left: 80px;
		}
	}
</style>
