import React, { useRef, useEffect, useCallback } from "react";

interface ClickSparkProps {
    sparkColor?: string;
    sparkSize?: number;
    sparkRadius?: number;
    sparkCount?: number;
    duration?: number;
    easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
    extraScale?: number;
    children?: React.ReactNode;
}

interface Spark {
    x: number;
    y: number;
    angle: number;
    startTime: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
    sparkColor = "#fff",
    sparkSize = 10,
    sparkRadius = 15,
    sparkCount = 8,
    duration = 400,
    easing = "ease-out",
    extraScale = 1.0,
    children
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const sparksRef = useRef<Spark[]>([]); // Stores spark data
    const startTimeRef = useRef<number | null>(null); // Tracks initial timestamp for animation

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        let resizeTimeout: any;

        const resizeCanvas = () => {
            try {
                const { width, height } = parent.getBoundingClientRect();
                // Only set if different to avoid layout thrash
                if (canvas.width !== Math.round(width) || canvas.height !== Math.round(height)) {
                    canvas.width = Math.round(width);
                    canvas.height = Math.round(height);
                }
            } catch (err) {
                // In non-browser environments, getBoundingClientRect may fail — ignore safely
            }
        };

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 100); // Debounce by 100ms
        };

        // Prefer ResizeObserver when available, fall back to window resize event
        let ro: ResizeObserver | null = null;
        if (typeof window !== 'undefined' && typeof (window as any).ResizeObserver === 'function') {
            try {
                ro = new (window as any).ResizeObserver(handleResize);
                if (ro) ro.observe(parent);
            } catch (err) {
                // If construction fails for any reason, fall back to resize event
                window.addEventListener('resize', handleResize);
            }
        } else if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
        }

        // Initial sizing (best-effort)
        resizeCanvas();

        // Cleanup
        return () => {
            try {
                if (ro && typeof ro.disconnect === 'function') ro.disconnect();
            } catch (err) {
                // ignore
            }
            if (typeof window !== 'undefined') window.removeEventListener('resize', handleResize as any);
            clearTimeout(resizeTimeout);
        };
    }, []);


    const easeFunc = useCallback(
        (t: number) => {
            switch (easing) {
                case "linear":
                    return t;
                case "ease-in":
                    return t * t;
                case "ease-in-out":
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                default:
                    return t * (2 - t);
            }
        },
        [easing]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
        if (!ctx) return; // nothing to draw without 2D context

        let animationId: number | null = null;
        const raf = (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function')
            ? window.requestAnimationFrame.bind(window)
            : (cb: FrameRequestCallback) => setTimeout(() => cb(Date.now()), 16);
        const caf = (typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function')
            ? window.cancelAnimationFrame.bind(window)
            : (id: number | null) => { if (typeof id === 'number') clearTimeout(id); };

        const draw = (timestamp: number) => {
            if (!startTimeRef.current) {
                startTimeRef.current = timestamp; // store initial time
            }
            try {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                sparksRef.current = sparksRef.current.filter((spark: Spark) => {
                    const elapsed = timestamp - spark.startTime;
                    if (elapsed >= duration) {
                        // Spark finished its animation
                        return false;
                    }

                    const progress = elapsed / duration;
                    const eased = easeFunc(progress);

                    const distance = eased * sparkRadius * extraScale;
                    const lineLength = sparkSize * (1 - eased);

                    // Points for the spark line
                    const x1 = spark.x + distance * Math.cos(spark.angle);
                    const y1 = spark.y + distance * Math.sin(spark.angle);
                    const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                    const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                    // Draw the spark line
                    ctx.strokeStyle = sparkColor;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();

                    return true;
                });
            } catch (err) {
                // Swallow drawing errors in non-standard environments
            }

            animationId = raf(draw as FrameRequestCallback) as unknown as number;
        };

        animationId = raf(draw as FrameRequestCallback) as unknown as number;

        return () => {
            if (animationId != null) caf(animationId);
        };
    }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const now = (typeof performance !== 'undefined' && typeof performance.now === 'function')
            ? performance.now()
            : Date.now();
        const newSparks: Spark[] = Array.from({length: sparkCount}, (_, i) => ({
            x,
            y,
            angle: (2 * Math.PI * i) / sparkCount,
            startTime: now,
        }));

        sparksRef.current.push(...newSparks);
    };

    return (
        <div style={{
            width:"100%",
            height:"100%",
            position:"relative"
        }}
        onClick={handleClick}
        >
            <canvas
                ref={canvasRef}
                style={{
                   position:"absolute",
                   inset:0,
                   pointerEvents:"none"
                }}
            />
            {children}
        </div>
    );
};

export default ClickSpark;
