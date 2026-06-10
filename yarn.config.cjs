/** @type {import('@yarnpkg/types')} */
const { defineConfig } = require(`@yarnpkg/types`)

/**
 * @param {Context} context
 */
function enforceConsistentDependenciesAcrossTheProject({ Yarn }) {
	// check non-peer deps:
	for (const dependency of Yarn.dependencies()) {
		if (dependency.type === 'peerDependencies') continue

		for (const otherDependency of Yarn.dependencies({ ident: dependency.ident })) {
			if (otherDependency.type === 'peerDependencies') continue

			dependency.update(otherDependency.range)
		}
	}

	// check peer deps:
	for (const dependency of Yarn.dependencies()) {
		if (dependency.type !== 'peerDependencies') continue

		for (const otherDependency of Yarn.dependencies({ ident: dependency.ident })) {
			if (otherDependency.type !== 'peerDependencies') continue

			dependency.update(otherDependency.range)
		}
	}

	for (const workspace of Yarn.workspaces()) {
		if (workspace.cwd === '.') continue

		workspace.set('packageManager', undefined)
	}
}

/**
 * Require a Node version where `require()` of an ES module works natively, so
 * published packages can depend on ESM-only modules without breaking CommonJS
 * consumers. `require(esm)` is unflagged in Node 20.19+ (backport) and 22.12+;
 * earlier versions throw `ERR_REQUIRE_ESM`.
 *
 * @param {Context} context
 */
function enforceNodeEngineOnPackages({ Yarn }) {
	const nodeEngine = '^20.19.0 || >=22.12.0'
	for (const workspace of Yarn.workspaces()) {
		// only the published library packages under packages/*
		if (!workspace.cwd.startsWith('packages/')) continue
		workspace.set(['engines', 'node'], nodeEngine)
	}
}

module.exports = defineConfig({
	constraints: async (ctx) => {
		enforceConsistentDependenciesAcrossTheProject(ctx)
		enforceNodeEngineOnPackages(ctx)
	},
})
