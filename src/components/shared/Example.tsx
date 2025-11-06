import { forwardRef, useImperativeHandle, useRef } from "react";

type ChildHandle = {
	focusInput: () => void;
};

const Child = forwardRef<ChildHandle>((_props, ref) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => ({
		focusInput() {
			inputRef.current?.focus();
		},
	}));

	return (
		<input
			ref={inputRef}
			className="border p-2 rounded"
			placeholder="Type here..."
		/>
	);
});

export default function Parent() {
	const childRef = useRef<ChildHandle>(null);

	return (
		<div className="flex flex-col gap-4">
			<Child ref={childRef} />
			<button
				type="button"
				className="bg-primary text-primary-foreground px-4 py-2 rounded"
				onClick={() => childRef.current?.focusInput()}
			>
				Focus from Parent
			</button>
		</div>
	);
}
