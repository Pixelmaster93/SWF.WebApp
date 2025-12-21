import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '--:--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

export const GameMinesweeper = ({ onEnd }) => {
    const SIZE = 6; const MINES = 5;
    const [grid, setGrid] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    useEffect(() => {
        let newGrid = Array(SIZE * SIZE).fill(null).map((_, i) => ({ id: i, isMine: false, isOpen: false, count: 0 }));
        let placed = 0; while (placed < MINES) { const idx = Math.floor(Math.random() * (SIZE * SIZE)); if (!newGrid[idx].isMine) { newGrid[idx].isMine = true; placed++; } }
        newGrid.forEach((cell, i) => { if (cell.isMine) return; let count = 0; const r = Math.floor(i / SIZE), c = i % SIZE; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { if (dr === 0 && dc === 0) continue; const nr = r + dr, nc = c + dc; if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && newGrid[nr * SIZE + nc].isMine) count++; } cell.count = count; });
        setGrid(newGrid);
    }, []);

    const reveal = (i, g) => { const c = g[i]; if (c.isOpen) return; c.isOpen = true; if (c.count === 0 && !c.isMine) { const r = Math.floor(i / SIZE), col = i % SIZE; for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) { const nr = r + dr, nc = col + dc; if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) reveal(nr * SIZE + nc, g); } } };
    const handleClick = (i) => { if (gameOver || grid[i].isOpen) return; const newGrid = JSON.parse(JSON.stringify(grid)); if (newGrid[i].isMine) { newGrid[i].isOpen = true; setGrid(newGrid); setGameOver(true); setTimeout(() => onEnd(0), 1000); } else { reveal(i, newGrid); setGrid(newGrid); if (newGrid.filter(c => c.isOpen).length === (SIZE * SIZE) - MINES) setTimeout(() => onEnd(200), 1000); } };

    return (
        <div className="h-full bg-gray-200 p-4 flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Campo Minato</h2>
            <div className="grid grid-cols-6 gap-1 bg-gray-400 p-2 rounded">{grid.map((c, i) => (<button key={i} onClick={() => handleClick(i)} className={`w-10 h-10 font-bold rounded-sm ${c.isOpen ? (c.isMine ? 'bg-red-500' : 'bg-gray-100') : 'bg-gray-300 hover:bg-gray-200'}`}>{c.isOpen && (c.isMine ? '💣' : (c.count > 0 ? c.count : ''))}</button>))}</div>
            {gameOver && <div className="mt-4 text-red-600 font-bold">BOOM!</div>}
        </div>
    );
};

export const GameSudoku = ({ onEnd }) => {
    const [board, setBoard] = useState([]); const [initial, setInitial] = useState([]); const [selected, setSelected] = useState(null); const [start] = useState(Date.now()); const [timer, setTimer] = useState(0); const [done, setDone] = useState(false);
    useEffect(() => {
        const seed = [5, 3, 4, 6, 7, 8, 9, 1, 2, 6, 7, 2, 1, 9, 5, 3, 4, 8, 1, 9, 8, 3, 4, 2, 5, 6, 7, 8, 5, 9, 7, 6, 1, 4, 2, 3, 4, 2, 6, 8, 5, 3, 7, 9, 1, 7, 1, 3, 9, 2, 4, 8, 5, 6, 9, 6, 1, 5, 3, 7, 2, 8, 4, 2, 8, 7, 4, 1, 9, 6, 3, 5, 3, 4, 5, 2, 8, 6, 1, 7, 9];
        let newB = [...seed], holes = 30, mask = Array(81).fill(true); while (holes > 0) { let i = Math.floor(Math.random() * 81); if (mask[i]) { newB[i] = null; mask[i] = false; holes--; } }
        setBoard(newB); setInitial(newB); const t = setInterval(() => { if (!done) setTimer(Math.floor((Date.now() - start) / 1000)); }, 1000); return () => clearInterval(t);
    }, [done]);
    const handleNum = (n) => { if (selected === null || initial[selected] !== null || done) return; const nb = [...board]; nb[selected] = n; setBoard(nb); if (!nb.includes(null)) { setDone(true); setTimeout(() => onEnd(timer), 500); } };
    return (
        <div className="h-full flex flex-col items-center justify-center bg-white p-2">
            <div className="flex justify-between w-full max-w-xs mb-2"><span className="font-bold">Sudoku</span><span>{formatTime(timer)}</span></div>
            <div className="grid grid-cols-9 border-2 border-black bg-black gap-px w-full max-w-xs aspect-square mb-4">{board.map((c, i) => (<div key={i} onClick={() => setSelected(i)} className={`bg-white flex items-center justify-center text-lg cursor-pointer ${selected === i ? 'bg-blue-200' : ''} ${initial[i] !== null ? 'font-bold' : ''} ${i % 9 === 2 || i % 9 === 5 ? 'mr-0.5' : ''} ${Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5 ? 'mb-0.5' : ''}`}>{c}</div>))}</div>
            <div className="grid grid-cols-5 gap-2">{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (<button key={n} onClick={() => handleNum(n)} className="bg-gray-100 w-10 h-10 rounded font-bold">{n}</button>))}<button onClick={() => handleNum(null)} className="bg-red-100 w-10 h-10 rounded text-red-600"><X size={20} /></button></div>
        </div>
    );
};

export const GameSnake = ({ onEnd }) => {
    const [snake, setSnake] = useState([{ r: 10, c: 5 }]); const [dir, setDir] = useState({ r: 0, c: 1 }); const [food, setFood] = useState({ r: 5, c: 5 }); const [score, setScore] = useState(0); const [over, setOver] = useState(false);
    useEffect(() => {
        const t = setInterval(() => {
            if (over) return; const h = snake[0], nh = { r: h.r + dir.r, c: h.c + dir.c };
            if (nh.r < 0 || nh.r >= 20 || nh.c < 0 || nh.c >= 15 || snake.some(s => s.r === nh.r && s.c === nh.c)) { setOver(true); clearInterval(t); setTimeout(() => onEnd(score), 1000); return; }
            const ns = [nh, ...snake]; if (nh.r === food.r && nh.c === food.c) { setScore(s => s + 1); setFood({ r: Math.floor(Math.random() * 20), c: Math.floor(Math.random() * 15) }); } else { ns.pop(); } setSnake(ns);
        }, 150); return () => clearInterval(t);
    }, [snake, dir, over]);
    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-800 text-white">
            <div className="mb-4 text-xl font-mono">Punti: {score}</div>
            <div className="relative bg-black border-4 border-gray-600" style={{ width: 15 * 15, height: 20 * 15 }}>
                <div className="absolute bg-red-500 rounded-full" style={{ width: 13, height: 13, top: food.r * 15 + 1, left: food.c * 15 + 1 }} />
                {snake.map((s, i) => (<div key={i} className="absolute bg-green-500 border border-black" style={{ width: 15, height: 15, top: s.r * 15, left: s.c * 15 }} />))}
                {over && <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-red-500 text-xl font-bold">CRASH!</div>}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 w-32"><div></div><button className="bg-gray-700 p-3 rounded" onClick={() => setDir({ r: -1, c: 0 })}><ChevronUp /></button><div></div><button className="bg-gray-700 p-3 rounded" onClick={() => setDir({ r: 0, c: -1 })}><ChevronDown className="rotate-90" /></button><button className="bg-gray-700 p-3 rounded" onClick={() => setDir({ r: 1, c: 0 })}><ChevronDown /></button><button className="bg-gray-700 p-3 rounded" onClick={() => setDir({ r: 0, c: 1 })}><ChevronUp className="rotate-90" /></button></div>
        </div>
    );
};

export const GameFlySwatter = ({ onEnd }) => {
    const [score, setScore] = useState(0); const [time, setTime] = useState(15); const [pos, setPos] = useState({ t: 50, l: 50 });
    useEffect(() => { const t = setInterval(() => setTime(prev => prev <= 1 ? (clearInterval(t), 0) : prev - 1), 1000); return () => clearInterval(t); }, []);
    useEffect(() => { if (time === 0) onEnd(score * 10); }, [time]);
    const tap = (e) => { e.stopPropagation(); setScore(s => s + 1); setPos({ t: Math.random() * 80 + 10, l: Math.random() * 80 + 10 }); };
    return (
        <div className="h-full bg-sky-100 relative overflow-hidden flex flex-col items-center p-4">
            <h2 className="font-bold text-sky-800">Schiaccia!</h2><div className="text-4xl font-mono">{score}</div>
            {time > 0 ? <button onPointerDown={tap} className="absolute text-5xl transition-all active:scale-75" style={{ top: pos.t + '%', left: pos.l + '%' }}>🪰</button> : <div className="text-2xl font-bold mt-10">Tempo Scaduto!</div>}
            <div className="w-full h-2 bg-white mt-auto rounded"><div className="h-full bg-sky-500 transition-all duration-1000" style={{ width: (time / 15) * 100 + '%' }} /></div>
        </div>
    );
};

export const GameClicker = ({ onEnd }) => {
    const [c, setC] = useState(0); const [t, setT] = useState(10); const [act, setAct] = useState(false);
    useEffect(() => { let i; if (act && t > 0) i = setInterval(() => setT(v => v - 1), 1000); else if (t === 0) onEnd(c); return () => clearInterval(i); }, [act, t]);
    return (
        <div className="h-full bg-rose-100 flex flex-col items-center justify-center p-4 text-center">
            {!act && t === 10 ? <button onClick={() => setAct(true)} className="bg-rose-500 text-white px-8 py-4 rounded-xl font-bold text-xl shadow-lg">START</button> :
                <><div className="text-6xl font-black text-rose-600 mb-8">{c}</div><button onPointerDown={() => setC(v => v + 1)} disabled={t === 0} className="w-48 h-48 bg-rose-500 rounded-full text-white font-bold text-2xl shadow-xl active:scale-95 flex items-center justify-center">TAP!</button><div className="mt-8 text-xl font-bold text-rose-800">{t}s</div></>}
        </div>
    );
};

export const GameMath = ({ onEnd }) => {
    const [q, setQ] = useState({ a: 0, b: 0, op: '+' }); const [s, setS] = useState(0); const [t, setT] = useState(30); const [inp, setInp] = useState('');
    useEffect(() => { gen(); const i = setInterval(() => setT(v => v <= 1 ? (clearInterval(i), 0) : v - 1), 1000); return () => clearInterval(i); }, []);
    useEffect(() => { if (t === 0) onEnd(s); }, [t]);
    const gen = () => { setQ({ a: Math.floor(Math.random() * 20), b: Math.floor(Math.random() * 20), op: Math.random() > .5 ? '+' : '-' }); setInp(''); };
    const sub = (e) => { e.preventDefault(); if (parseInt(inp) === (q.op === '+' ? q.a + q.b : q.a - q.b)) { setS(v => v + 1); gen(); } else setInp(''); };
    return (
        <div className="h-full bg-emerald-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xs text-center mb-6"><div className="text-4xl font-bold text-emerald-900 mb-4">{q.a} {q.op} {q.b} = ?</div><form onSubmit={sub}><input type="number" value={inp} onChange={e => setInp(e.target.value)} className="w-full text-center text-3xl p-2 border-b-4 border-emerald-300 focus:outline-none" autoFocus /></form></div><div className="font-mono text-emerald-700">{t}s</div>
        </div>
    );
};

export const GameMemory = ({ onEnd }) => {
    const E = ['💩', '🚽', '🧻', '🦠', '🧼', '🪠', '🧴', '🛁']; const [cards, setCards] = useState([]); const [flip, setFlip] = useState([]); const [solved, setSolved] = useState([]); const [mv, setMv] = useState(0);
    useEffect(() => setCards([...E, ...E].sort(() => Math.random() - .5).map((e, i) => ({ id: i, e }))), []);
    useEffect(() => { if (flip.length === 2) { if (cards[flip[0]].e === cards[flip[1]].e) { setSolved([...solved, flip[0], flip[1]]); setFlip([]); } else setTimeout(() => setFlip([]), 800); setMv(m => m + 1); } }, [flip]);
    useEffect(() => { if (cards.length > 0 && solved.length === cards.length) setTimeout(() => onEnd(Math.max(0, 100 - mv * 2)), 1000); }, [solved]);
    return (
        <div className="h-full bg-indigo-100 p-4 flex flex-col items-center"><h2 className="text-xl font-bold text-indigo-800 mb-4">Memory</h2><div className="grid grid-cols-4 gap-2 w-full max-w-xs aspect-square">{cards.map((c, i) => (<button key={i} onClick={() => { if (!flip.includes(i) && !solved.includes(i) && flip.length < 2) setFlip([...flip, i]) }} className={`rounded-xl text-3xl flex items-center justify-center transition-all ${flip.includes(i) || solved.includes(i) ? 'bg-white rotate-0' : 'bg-indigo-400 rotate-180 text-transparent'}`}>{flip.includes(i) || solved.includes(i) ? c.e : ''}</button>))}</div><div className="mt-6 font-bold text-indigo-600">Mosse: {mv}</div></div>
    );
};

export const GameReaction = ({ onEnd }) => {
    const [st, setSt] = useState('w'); const [ms, setMs] = useState(0); const ref = useRef(0); const tRef = useRef(0);
    useEffect(() => { const d = 2000 + Math.random() * 3000; tRef.current = setTimeout(() => { setSt('r'); ref.current = Date.now(); }, d); return () => clearTimeout(tRef.current); }, []);
    const click = () => { if (st === 'w') { clearTimeout(tRef.current); setSt('e'); setTimeout(() => onEnd(0), 1000); } else if (st === 'r') { const d = Date.now() - ref.current; setMs(d); setSt('c'); setTimeout(() => onEnd(Math.max(0, 500 - d) + 50), 2000); } };
    return (
        <div onPointerDown={click} className={`h-full flex flex-col items-center justify-center p-6 text-center select-none ${st === 'w' ? 'bg-red-500' : st === 'r' ? 'bg-green-500' : st === 'e' ? 'bg-yellow-500' : 'bg-blue-500'}`}>{st === 'w' && <h2 className="text-3xl font-black text-white">ASPETTA...</h2>}{st === 'r' && <h2 className="text-5xl font-black text-white">CLICCA!</h2>}{st === 'e' && <h2 className="text-3xl font-black text-white">PRESTO!</h2>}{st === 'c' && <div><h2 className="text-4xl font-black text-white">{ms} ms</h2></div>}</div>
    );
};

export const GameSimon = ({ onEnd }) => {
    const C = ['red', 'green', 'blue', 'yellow']; const [seq, setSeq] = useState([]); const [play, setPlay] = useState(false); const [uIdx, setUIdx] = useState(0); const [lit, setLit] = useState(null); const [rnd, setRnd] = useState(0);
    const add = () => { setSeq(p => [...p, C[Math.floor(Math.random() * 4)]]); setRnd(r => r + 1); setUIdx(0); setPlay(true); };
    useEffect(() => add(), []);
    useEffect(() => { if (play) { let i = 0; const int = setInterval(() => { setLit(seq[i]); setTimeout(() => setLit(null), 400); i++; if (i >= seq.length) { clearInterval(int); setPlay(false); } }, 800); return () => clearInterval(int); } }, [seq, play]);
    const tap = (c) => { if (play) return; setLit(c); setTimeout(() => setLit(null), 200); if (c !== seq[uIdx]) onEnd(rnd * 10); else { if (uIdx + 1 === seq.length) setTimeout(add, 1000); else setUIdx(u => u + 1); } };
    const cls = (c) => `w-24 h-24 rounded-2xl shadow-xl active:scale-95 border-4 border-black/10 ${c === 'red' ? (lit === 'red' ? 'bg-red-400' : 'bg-red-600') : c === 'green' ? (lit === 'green' ? 'bg-green-400' : 'bg-green-600') : c === 'blue' ? (lit === 'blue' ? 'bg-blue-400' : 'bg-blue-600') : (lit === 'yellow' ? 'bg-yellow-300' : 'bg-yellow-500')}`;
    return (
        <div className="h-full bg-gray-800 flex flex-col items-center justify-center p-6"><h2 className="text-white text-2xl font-bold mb-8">Round: {rnd}</h2><div className="grid grid-cols-2 gap-4">{C.map(c => (<button key={c} onClick={() => tap(c)} className={cls(c)} />))}</div><p className="text-gray-400 mt-8 text-sm">{play ? 'Osserva...' : 'Tocca!'}</p></div>
    );
};
