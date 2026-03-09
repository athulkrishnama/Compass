export default function CommonErrorComponent() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6">
            <div className="max-w-2xl text-center">
                <div className="mb-12 flex justify-center">
                    <svg
                        width="160"
                        height="160"
                        viewBox="0 0 64 64"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M26 12V8C26 6.5 27 6 28 6H36C37 6 38 6.5 38 8V12"
                            fill="black"
                        />
                        <text
                            x="32"
                            y="10.5"
                            fontSize="4"
                            fontWeight="bold"
                            textAnchor="middle"
                            fill="white"
                        >
                            TAXI
                        </text>

                        <path
                            d="M8 32C8 28.5 10 24 16 24L20 16C21 14 24 12 28 12H36C40 12 43 14 44 16L48 24C54 24 56 28.5 56 32V44C56 46 54 48 52 48H48V52C48 54 46 56 44 56C42 56 40 54 40 52V48H24V52C24 54 22 56 20 56C18 56 16 54 16 52V48H12C10 48 8 46 8 44V32Z"
                            fill="black"
                        />

                        <path d="M22 17L18.5 24H45.5L42 17H22Z" fill="white" />
                        <path d="M32 17V24" stroke="black" strokeWidth="2" />

                        <circle cx="14" cy="36" r="3" fill="white" />
                        <circle cx="50" cy="36" r="3" fill="white" />

                        <rect
                            x="24"
                            y="34"
                            width="16"
                            height="6"
                            rx="1"
                            fill="white"
                        />
                        <rect x="26" y="35" width="2" height="4" fill="black" />
                        <rect x="31" y="35" width="2" height="4" fill="black" />
                        <rect x="36" y="35" width="2" height="4" fill="black" />

                        <g transform="translate(8, 26)">
                            <rect
                                x="0"
                                y="0"
                                width="48"
                                height="4"
                                fill="white"
                            />
                            <rect
                                x="4"
                                y="0"
                                width="4"
                                height="4"
                                fill="black"
                            />
                            <rect
                                x="12"
                                y="0"
                                width="4"
                                height="4"
                                fill="black"
                            />
                            <rect
                                x="20"
                                y="0"
                                width="4"
                                height="4"
                                fill="black"
                            />
                            <rect
                                x="28"
                                y="0"
                                width="4"
                                height="4"
                                fill="black"
                            />
                            <rect
                                x="36"
                                y="0"
                                width="4"
                                height="4"
                                fill="black"
                            />
                            <rect
                                x="44"
                                y="0"
                                width="4"
                                height="4"
                                fill="black"
                            />
                        </g>

                        <circle cx="16" cy="52" r="2" fill="white" />
                        <circle cx="48" cy="52" r="2" fill="white" />
                    </svg>
                </div>

                <h1 className="text-4xl font-semibold tracking-tight text-black">
                    A component just lost the plot.
                </h1>

                <div className="mx-auto my-6 h-px w-40 bg-neutral-300" />

                <p className="text-neutral-600 text-lg">
                    The system caught it before the page collapsed.
                </p>
            </div>
        </div>
    );
}
