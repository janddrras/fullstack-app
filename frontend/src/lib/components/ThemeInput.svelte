<script lang="ts">
	let theme = $state('')
	let error = $state('')

	let submitFunction = $props()

	function handleSubmit(e: Event) {
		e.preventDefault()
		if (!theme.trim()) error = 'Please enter a theme'
		submitFunction(theme)
	}
</script>

<div class="theme-input-container">
	<h2>Generate Your Adventure</h2>
	<p>Enter a theme for your interactive story</p>

	<form onsubmit={handleSubmit}>
		<div class="input-group">
			<input
				type="text"
				bind:value={theme}
				placeholder="Enter a theme (e.g. prirates, space, medieval...)"
				class={error ? 'error' : ''}
			/>
			{#if error && error.length > 0}
				<p class="error-text">{error}</p>
			{/if}
		</div>

		<button type="submit" class="generate-btn"> Generate Story </button>
	</form>
</div>
