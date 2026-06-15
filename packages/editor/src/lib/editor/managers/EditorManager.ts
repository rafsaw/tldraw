import type { Editor } from '../Editor'
import type { TLEventMap } from '../types/emit-types'

/** @internal */
export abstract class EditorManager {
	protected readonly disposables = new Set<() => void>()

	constructor(protected readonly editor: Editor) {}

	protected _register(dispose: () => void): () => void {
		this.disposables.add(dispose)
		return dispose
	}

	protected onEditor<E extends keyof TLEventMap>(
		event: E,
		fn: (...args: TLEventMap[E]) => void
	): void {
		this.editor.on(event, fn as any)
		this._register(() => this.editor.off(event, fn as any))
	}

	/** @internal */
	dispose(): void {
		this.disposables.forEach((d) => d())
		this.disposables.clear()
	}
}
