import { Text, component, memo, useState, useEffect, DarkElement, startTransition } from '@dark-engine/core';
import { createRoot } from '@dark-engine/platform-browser';
import { useStyle } from '@dark-engine/styled';

const targetSize = 25;

type DotProps = {
  size: number;
  x: number;
  y: number;
  slot: DarkElement;
};

const Dot = component<DotProps>(props => {
  const [hover, setHover] = useState(false);
  const s = props.size * 1.3;
  const style = useStyle(styled => ({
    dot: styled`
      position: absolute;
      text-align: center;
      white-space: nowrap;
      cursor: pointer;
      width: ${s}px;
      height: ${s}px;
      left: ${props.x}px;
      top: ${props.y}px;
      border-radius: ${s / 2}px;
      line-height: ${s}px;
      background-color: ${hover ? 'yellow' : '#61dafb'};
    `,
  }));

  const enter = () => setHover(true);

  const leave = () => setHover(false);

  const text = Number(Text.from(props.slot));

  return (
    <div style={style.dot} onMouseEnter={enter} onMouseLeave={leave}>
      {hover ? ` **${text}**` : text}
    </div>
  );
});

type SierpinskiTriangleProps = {
  s: number;
  x: number;
  y: number;
  id?: number;
  slot: DarkElement;
};

const SierpinskiTriangle = component<SierpinskiTriangleProps>(({ x, y, s, slot }) => {
  if (s <= targetSize) {
    return (
      <Dot x={x - targetSize / 2} y={y - targetSize / 2} size={targetSize}>
        {slot}
      </Dot>
    );
  }

  s /= 2;

  const slowDown = true;
  if (slowDown) {
    const e = performance.now() + 0.8;
    while (performance.now() < e) {
      // Artificially long execution time.
    }
  }

  return (
    <>
      <SierpinskiTriangle x={x} y={y - s / 2} s={s}>
        {slot}
      </SierpinskiTriangle>
      <SierpinskiTriangle x={x - s} y={y + s / 2} s={s}>
        {slot}
      </SierpinskiTriangle>
      <SierpinskiTriangle x={x + s} y={y + s / 2} s={s}>
        {slot}
      </SierpinskiTriangle>
    </>
  );
});

const MemoSierpinskiTriangle = memo(
  SierpinskiTriangle,
  (p, n) => p.x !== n.x || p.y !== n.y || p.s !== n.s || Text.from(p.slot) !== Text.from(n.slot),
);

type AppProps = {
  elapsed: number;
};

const App = component<AppProps>(props => {
  const [seconds, setSeconds] = useState(0);
  const elapsed = props.elapsed;
  const t = (elapsed / 1000) % 10;
  const scale = 1 + (t > 5 ? 10 - t : t) / 10;

  useEffect(() => {
    setInterval(() => {
      startTransition(() => {
        setSeconds(seconds => (seconds % 10) + 1);
      });
    }, 1000);
  }, []);

  const style = useStyle(styled => ({
    container: styled`
      position: absolute;
      left: 50%;
      top: 50%;
      transform-origin: 0 0;
      background-color: #eee;
      transform: scaleX(${scale / 2.1}) scaleY(0.7);
    `,
  }));

  return (
    <div class='container'>
      <div style={style.container}>
        <MemoSierpinskiTriangle x={0} y={0} s={1000}>
          {seconds}
        </MemoSierpinskiTriangle>
      </div>
    </div>
  );
});

const start = new Date().getTime();
const root = createRoot(document.getElementById('root'));

function run() {
  root.render(<App elapsed={new Date().getTime() - start} />);

  requestAnimationFrame(run);
}

run();
