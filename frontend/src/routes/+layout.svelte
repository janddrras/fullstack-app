<script lang="ts">
	import './app.css'
	let { children } = $props()
</script>

<div class="app-container">
	<header>
		<h1>Interactive Story Generator</h1>
	</header>
	<main>
		{@render children()}
	</main>
</div>
