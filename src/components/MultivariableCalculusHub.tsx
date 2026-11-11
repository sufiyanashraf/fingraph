import { useState, useMemo, useRef } from 'react';
import * as math from 'mathjs';
import {
  Compass,
  LineChart,
  BookOpen,
  CheckCircle2,
  XCircle,
  Keyboard,
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronRight,
  HelpCircle,
  Search,
  Activity,
  Layers,
  FileText,
  Target,
  Navigation,
  Globe,
  Grid
} from 'lucide-react';
import MathVirtualKeyboard from './MathVirtualKeyboard';

type MainTab =
  | 'overview'
  | 'coordinates'
  | 'surfaces'
  | 'level_curves'
  | 'limits_continuity'
  | 'partials'
  | 'gradient'
  | 'tangent_planes'
  | 'optimization'
  | 'lagrange'
  | 'integrals'
  | 'vector_calculus'
  | 'solver'
  | 'decision_tree'
  | 'quiz'
  | 'formulas';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'For z = f(x, y), what does the partial derivative ∂f/∂x represent geometrically?',
    options: [
      'The slope of the surface in the direction parallel to the x-axis (with y held constant)',
      'The normal vector to the tangent plane',
      'The rate of change in every 360-degree direction simultaneously',
      'The volume enclosed underneath the surface'
    ],
    correctIdx: 0,
    explanation: '∂f/∂x measures how f changes strictly along the x-direction while holding y as a frozen constant parameter.'
  },
  {
    id: 'q2',
    question: 'In what direction does the gradient vector ∇f(x, y) point on a surface?',
    options: [
      'In the direction of zero change (along the level curve)',
      'In the direction of greatest/steepest ascent',
      'Directly towards the origin (0, 0)',
      'Downwards along the steepest descent path'
    ],
    correctIdx: 1,
    explanation: '∇f always points in the direction of maximum directional derivative, which is the path of steepest ascent. Its magnitude is that maximum rate.'
  },
  {
    id: 'q3',
    question: 'According to Clairaut’s Theorem on mixed partial derivatives, when is f_xy = f_yx?',
    options: [
      'Only when f(x, y) is a linear polynomial',
      'Whenever the mixed second partial derivatives are continuous',
      'Only at critical points where the gradient is zero',
      'Never, because differentiation order always matters'
    ],
    correctIdx: 1,
    explanation: 'If f_xy and f_yx are both continuous on an open disc around a point, Clairaut’s Theorem guarantees that f_xy = f_yx.'
  },
  {
    id: 'q4',
    question: 'For a critical point where ∇f = 0, what does D = f_xx · f_yy - (f_xy)² < 0 indicate?',
    options: [
      'Local Maximum',
      'Local Minimum',
      'Saddle Point',
      'The test is inconclusive'
    ],
    correctIdx: 2,
    explanation: 'When the discriminant (Hessian determinant) D < 0, the surface curves upwards in one direction and downwards in another, forming a saddle point.'
  },
  {
    id: 'q5',
    question: 'What is the area element dA when converting a double integral to polar coordinates (r, θ)?',
    options: [
      'dr dθ',
      'r dr dθ',
      'r² dr dθ',
      '(1/r) dr dθ'
    ],
    correctIdx: 1,
    explanation: 'Because of the stretching of coordinate wedges (the Jacobian determinant of x=r cos θ, y=r sin θ), dA = r dr dθ.'
  },
  {
    id: 'q6',
    question: 'What does the Divergence (∇ · F) of a 3D vector field measure physically at a point?',
    options: [
      'The local rate of rotation or swirl of the fluid',
      'The net outward flux density (source vs sink expansion rate)',
      'The work done along a closed boundary curve',
      'The maximum steepness of the potential surface'
    ],
    correctIdx: 1,
    explanation: 'Divergence measures expansion/compression: positive divergence indicates a source (fluid expanding outward), negative indicates a sink (fluid converging).'
  }
];

export default function MultivariableCalculusHub() {
  const [activeTab, setActiveTab] = useState<MainTab>('overview');

  // Virtual keyboard state
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const activeInputRef = useRef<HTMLInputElement | null>(null);

  // 3D Surfaces Explorer state
  const [surfacePreset, setSurfacePreset] = useState<'paraboloid' | 'saddle' | 'waves' | 'plane' | 'cone'>('paraboloid');
  const [rotAngle, setRotAngle] = useState<number>(35); // yaw
  const [elevation, setElevation] = useState<number>(25); // pitch
  const [probeX, setProbeX] = useState<number>(0.8);
  const [probeY, setProbeY] = useState<number>(0.6);

  // Coordinates tab state
  const [coordX, setCoordX] = useState<number>(2);
  const [coordY, setCoordY] = useState<number>(2);
  const [coordZ, setCoordZ] = useState<number>(2.5);

  // Level Curves Slicing Plane State
  const [sliceLevel, setSliceLevel] = useState<number>(1.5);

  // Gradient & Directional Derivative Compass Angle
  const [compassAngleDeg, setCompassAngleDeg] = useState<number>(45);

  // Multivariable Solver State
  const [solverExpr, setSolverExpr] = useState<string>('x^2 + 3*y^2 - 4*x - 6*y');
  const [solverX0, setSolverX0] = useState<string>('2');
  const [solverY0, setSolverY0] = useState<string>('1');

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Formula search
  const [formulaSearch, setFormulaSearch] = useState<string>('');

  // Decision tree
  const [decisionQuery, setDecisionQuery] = useState<string>('rate');

  // Math keyboard insertion helper
  const handleKeyboardInsert = (token: string) => {
    if (activeInputRef.current) {
      const input = activeInputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const cur = input.value;
      const next = cur.slice(0, start) + token + cur.slice(end);
      setSolverExpr(next);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + token.length, start + token.length);
      }, 10);
    } else {
      setSolverExpr((prev) => prev + token);
    }
  };

  const handleKeyboardDelete = () => {
    if (activeInputRef.current) {
      const input = activeInputRef.current;
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const cur = input.value;
      if (start === end && start > 0) {
        const next = cur.slice(0, start - 1) + cur.slice(end);
        setSolverExpr(next);
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(start - 1, start - 1);
        }, 10);
      } else if (start !== end) {
        const next = cur.slice(0, start) + cur.slice(end);
        setSolverExpr(next);
        setTimeout(() => {
          input.focus();
          input.setSelectionRange(start, start);
        }, 10);
      }
    } else {
      setSolverExpr((prev) => prev.slice(0, -1));
    }
  };

  const handleKeyboardClear = () => {
    setSolverExpr('');
  };

  // 3D coordinate conversions
  const cylindricalCoords = useMemo(() => {
    const r = Math.sqrt(coordX * coordX + coordY * coordY);
    let thetaRad = Math.atan2(coordY, coordX);
    let thetaDeg = (thetaRad * 180) / Math.PI;
    if (thetaDeg < 0) thetaDeg += 360;
    return {
      r: Number(r.toFixed(3)),
      thetaDeg: Number(thetaDeg.toFixed(1)),
      thetaRad: Number(thetaRad.toFixed(3)),
      z: coordZ
    };
  }, [coordX, coordY, coordZ]);

  const sphericalCoords = useMemo(() => {
    const rho = Math.sqrt(coordX * coordX + coordY * coordY + coordZ * coordZ);
    let thetaRad = Math.atan2(coordY, coordX);
    let thetaDeg = (thetaRad * 180) / Math.PI;
    if (thetaDeg < 0) thetaDeg += 360;
    const phiRad = rho === 0 ? 0 : Math.acos(coordZ / rho);
    const phiDeg = (phiRad * 180) / Math.PI;
    return {
      rho: Number(rho.toFixed(3)),
      thetaDeg: Number(thetaDeg.toFixed(1)),
      phiDeg: Number(phiDeg.toFixed(1)),
      phiRad: Number(phiRad.toFixed(3))
    };
  }, [coordX, coordY, coordZ]);

  // Evaluator function for chosen surface preset
  const evalSurfaceZ = (x: number, y: number, preset: typeof surfacePreset): number => {
    switch (preset) {
      case 'paraboloid':
        return 0.5 * (x * x + y * y);
      case 'saddle':
        return 0.5 * (x * x - y * y);
      case 'waves':
        return Math.sin(x * 1.5) * Math.cos(y * 1.5);
      case 'plane':
        return 0.4 * x + 0.3 * y + 0.8;
      case 'cone':
        return Math.sqrt(x * x + y * y);
      default:
        return 0.5 * (x * x + y * y);
    }
  };

  // 3D projection helper (Isometric / Orthographic rotation)
  const project3D = (x: number, y: number, z: number, yawDeg: number, pitchDeg: number) => {
    const yaw = (yawDeg * Math.PI) / 180;
    const pitch = (pitchDeg * Math.PI) / 180;

    // Rotate around Z axis (yaw)
    const x1 = x * Math.cos(yaw) - y * Math.sin(yaw);
    const y1 = x * Math.sin(yaw) + y * Math.cos(yaw);
    const z1 = z;

    // Rotate around X axis (pitch)
    const x2 = x1;
    const y2 = y1 * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = y1 * Math.sin(pitch) + z1 * Math.cos(pitch);

    // Canvas mapping: center at (200, 160), scale factor 38
    const scale = 36;
    const screenX = 200 + x2 * scale;
    const screenY = 160 - z2 * scale + y2 * (scale * 0.35);

    return { screenX, screenY, depth: y2 };
  };

  // Generate 3D surface mesh lines
  const surfaceMesh = useMemo(() => {
    const lines: { path: string; stroke: string }[] = [];
    const step = 0.4;
    const range = 2.4;

    // Constant x curves (along y)
    for (let x = -range; x <= range + 0.01; x += step) {
      let d = '';
      for (let y = -range; y <= range + 0.01; y += 0.2) {
        const z = evalSurfaceZ(x, y, surfacePreset);
        const { screenX, screenY } = project3D(x, y, z, rotAngle, elevation);
        d += d === '' ? `M ${screenX.toFixed(1)} ${screenY.toFixed(1)}` : ` L ${screenX.toFixed(1)} ${screenY.toFixed(1)}`;
      }
      lines.push({ path: d, stroke: 'rgba(56, 189, 248, 0.4)' });
    }

    // Constant y curves (along x)
    for (let y = -range; y <= range + 0.01; y += step) {
      let d = '';
      for (let x = -range; x <= range + 0.01; x += 0.2) {
        const z = evalSurfaceZ(x, y, surfacePreset);
        const { screenX, screenY } = project3D(x, y, z, rotAngle, elevation);
        d += d === '' ? `M ${screenX.toFixed(1)} ${screenY.toFixed(1)}` : ` L ${screenX.toFixed(1)} ${screenY.toFixed(1)}`;
      }
      lines.push({ path: d, stroke: 'rgba(96, 165, 250, 0.35)' });
    }

    return lines;
  }, [surfacePreset, rotAngle, elevation]);

  // Projected probe coordinates on 3D surface
  const probeProjected = useMemo(() => {
    const z = evalSurfaceZ(probeX, probeY, surfacePreset);
    return {
      z: Number(z.toFixed(3)),
      ...project3D(probeX, probeY, z, rotAngle, elevation)
    };
  }, [probeX, probeY, surfacePreset, rotAngle, elevation]);

  // Directional derivative computation based on compass angle
  const directionalDerivInfo = useMemo(() => {
    // Let's use test function f(x, y) = x^2 + 2y^2 at point (1, 1)
    const x0 = 1;
    const y0 = 1;
    const fx = 2 * x0; // = 2
    const fy = 4 * y0; // = 4
    const gradMag = Math.sqrt(fx * fx + fy * fy); // sqrt(20) ≈ 4.472
    const gradAngleDeg = (Math.atan2(fy, fx) * 180) / Math.PI; // atan2(4, 2) ≈ 63.43°

    const thetaRad = (compassAngleDeg * Math.PI) / 180;
    const ux = Math.cos(thetaRad);
    const uy = Math.sin(thetaRad);

    const D_u = fx * ux + fy * uy;

    return {
      fx,
      fy,
      gradMag: Number(gradMag.toFixed(3)),
      gradAngleDeg: Number(gradAngleDeg.toFixed(1)),
      ux: Number(ux.toFixed(3)),
      uy: Number(uy.toFixed(3)),
      Du: Number(D_u.toFixed(3))
    };
  }, [compassAngleDeg]);

  // Multivariable Solver Analysis
  const solverAnalysis = useMemo(() => {
    const x0 = parseFloat(solverX0) || 0;
    const y0 = parseFloat(solverY0) || 0;

    let fxStr = '';
    let fyStr = '';
    let fxxStr = '';
    let fyyStr = '';
    let fxyStr = '';

    let fxVal = 0;
    let fyVal = 0;
    let fxxVal = 0;
    let fyyVal = 0;
    let fxyVal = 0;
    let fVal = 0;
    let discriminant = 0;
    let classification = '';

    try {
      const parsed = math.parse(solverExpr);

      // Derivatives using math.derivative
      const d_dx = math.derivative(parsed, 'x');
      const d_dy = math.derivative(parsed, 'y');
      const d_dx2 = math.derivative(d_dx, 'x');
      const d_dy2 = math.derivative(d_dy, 'y');
      const d_dxdy = math.derivative(d_dx, 'y');

      fxStr = d_dx.toString();
      fyStr = d_dy.toString();
      fxxStr = d_dx2.toString();
      fyyStr = d_dy2.toString();
      fxyStr = d_dxdy.toString();

      // Evaluations
      fVal = parsed.evaluate({ x: x0, y: y0 });
      fxVal = d_dx.evaluate({ x: x0, y: y0 });
      fyVal = d_dy.evaluate({ x: x0, y: y0 });
      fxxVal = d_dx2.evaluate({ x: x0, y: y0 });
      fyyVal = d_dy2.evaluate({ x: x0, y: y0 });
      fxyVal = d_dxdy.evaluate({ x: x0, y: y0 });

      // Discriminant D = f_xx * f_yy - (f_xy)^2
      discriminant = fxxVal * fyyVal - fxyVal * fxyVal;

      const isStationary = Math.abs(fxVal) < 1e-4 && Math.abs(fyVal) < 1e-4;

      if (!isStationary) {
        classification = `Point (${x0}, ${y0}) is NOT a critical point because ∇f = ⟨${fxVal.toFixed(2)}, ${fyVal.toFixed(2)}⟩ ≠ ⟨0, 0⟩. Tangent plane is sloped.`;
      } else {
        if (discriminant > 0 && fxxVal > 0) {
          classification = `Local Minimum (D = ${discriminant.toFixed(2)} > 0 and f_xx = ${fxxVal.toFixed(2)} > 0)`;
        } else if (discriminant > 0 && fxxVal < 0) {
          classification = `Local Maximum (D = ${discriminant.toFixed(2)} > 0 and f_xx = ${fxxVal.toFixed(2)} < 0)`;
        } else if (discriminant < 0) {
          classification = `Saddle Point (D = ${discriminant.toFixed(2)} < 0)`;
        } else {
          classification = `Inconclusive (D = 0, higher-order terms must be checked)`;
        }
      }

      // Tangent plane formula: z = z0 + fx(x - x0) + fy(y - y0)
      const tangentPlaneStr = `z = ${fVal.toFixed(2)} + ${fxVal.toFixed(2)}(x - ${x0}) + ${fyVal.toFixed(2)}(y - ${y0})`;

      return {
        success: true,
        fVal: Number(fVal.toFixed(3)),
        fxStr,
        fyStr,
        fxxStr,
        fyyStr,
        fxyStr,
        fxVal: Number(fxVal.toFixed(3)),
        fyVal: Number(fyVal.toFixed(3)),
        fxxVal: Number(fxxVal.toFixed(3)),
        fyyVal: Number(fyyVal.toFixed(3)),
        fxyVal: Number(fxyVal.toFixed(3)),
        discriminant: Number(discriminant.toFixed(3)),
        classification,
        tangentPlaneStr,
        isStationary
      };
    } catch {
      return {
        success: false,
        error: 'Unable to parse multivariable expression. Use standard syntax like x^2 + y^2 or sin(x)*y.'
      };
    }
  }, [solverExpr, solverX0, solverY0]);

  // Formula database
  const FORMULAS = [
    {
      title: 'Partial Derivative (with respect to x)',
      latex: '∂f/∂x = lim[h→0] (f(x+h, y) - f(x, y)) / h',
      meaning: 'Rate of change of f strictly along the x-direction while treating y as a constant.'
    },
    {
      title: 'Partial Derivative (with respect to y)',
      latex: '∂f/∂y = lim[h→0] (f(x, y+h) - f(x, y)) / h',
      meaning: 'Rate of change of f strictly along the y-direction while treating x as a constant.'
    },
    {
      title: 'Gradient Vector ∇f',
      latex: '∇f(x, y) = ⟨∂f/∂x, ∂f/∂y⟩',
      meaning: 'Vector pointing in the direction of maximum rate of increase (steepest ascent).'
    },
    {
      title: 'Directional Derivative D_u f',
      latex: 'D_u f = ∇f · u = |∇f| cos(θ)',
      meaning: 'Rate of change in the direction of unit vector u = ⟨cos θ, sin θ⟩.'
    },
    {
      title: 'Tangent Plane Equation',
      latex: 'z - z₀ = f_x(x₀, y₀)(x - x₀) + f_y(x₀, y₀)(y - y₀)',
      meaning: 'Flat planar linear approximation touching the surface at point (x₀, y₀, z₀).'
    },
    {
      title: 'Total Differential dz',
      latex: 'dz = (∂f/∂x) dx + (∂f/∂y) dy',
      meaning: 'Approximates the small change Δz caused by small coordinate shifts dx and dy.'
    },
    {
      title: 'Second Derivative Test Discriminant (Hessian)',
      latex: 'D = f_xx · f_yy - (f_xy)²',
      meaning: 'Classifies critical points where ∇f = 0: D>0 & f_xx>0 (min), D>0 & f_xx<0 (max), D<0 (saddle).'
    },
    {
      title: 'Lagrange Multipliers (Constrained Extrema)',
      latex: '∇f = λ ∇g  and  g(x, y) = c',
      meaning: 'At extreme points subject to constraint g(x,y)=c, the gradient of f is parallel to the normal of the constraint.'
    },
    {
      title: 'Double Integral in Polar Coordinates',
      latex: '∬_R f(x, y) dA = ∫_α^β ∫_a^b f(r cos θ, r sin θ) · r dr dθ',
      meaning: 'Cartesian to polar conversion factor includes the Jacobian determinant r.'
    },
    {
      title: 'Divergence of a Vector Field',
      latex: 'div F = ∇ · F = ∂P/∂x + ∂Q/∂y + ∂R/∂z',
      meaning: 'Scalar measuring net outward flux density (sources vs. sinks) per unit volume.'
    },
    {
      title: 'Curl of a 3D Vector Field',
      latex: 'curl F = ∇ × F = det [ i j k ; ∂/∂x ∂/∂y ∂/∂z ; P Q R ]',
      meaning: 'Vector measuring microscopic axis and speed of rotational swirl/vorticity.'
    },
    {
      title: 'Green’s Theorem (in the Plane)',
      latex: '∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA',
      meaning: 'Relates circulation line integral around boundary C to the curl area integral over interior region D.'
    },
    {
      title: 'Stokes’ Theorem',
      latex: '∮_C F · dr = ∬_S (curl F) · dS',
      meaning: 'Relates the work line integral along the boundary of surface S to flux of curl F through S.'
    },
    {
      title: 'Divergence Theorem (Gauss’ Theorem)',
      latex: '∬_S F · dS = ∭_E (div F) dV',
      meaning: 'Relates total outward flux across closed surface S to total divergence integrated over interior solid E.'
    }
  ];

  return (
    <div className="w-full text-slate-100 font-sans space-y-6">
      {/* ─── HERO HEADER ─── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b162f] via-[#091530] to-[#060c1d] border border-[#162c57] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-[11px] font-medium text-blue-300">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              ADVANCED CALCULUS & VECTOR FIELDS
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight">
              Multivariable Calculus Hub
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Step from 1D lines into multi-dimensional space. Visualize surfaces <span className="text-blue-300 font-mono">z = f(x, y)</span>, explore partial slopes, follow the gradient of steepest ascent, and master line integrals and Gauss-Stokes theorems.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 gap-2.5 shrink-0 bg-[#07122a]/80 p-3.5 rounded-xl border border-blue-900/40">
            <div className="text-center p-2 rounded-lg bg-[#0b1c3e]">
              <div className="text-xs text-slate-400">Dimensions</div>
              <div className="text-base font-semibold text-cyan-300 font-mono">ℝ², ℝ³, ℝⁿ</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[#0b1c3e]">
              <div className="text-xs text-slate-400">Gradient Operator</div>
              <div className="text-base font-semibold text-blue-400 font-mono">∇ = ⟨∂x, ∂y⟩</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[#0b1c3e]">
              <div className="text-xs text-slate-400">Hessian Matrix</div>
              <div className="text-base font-semibold text-emerald-300 font-mono">D = f_xx f_yy - f_xy²</div>
            </div>
            <div className="text-center p-2 rounded-lg bg-[#0b1c3e]">
              <div className="text-xs text-slate-400">Core Theorems</div>
              <div className="text-base font-semibold text-amber-300 font-mono">Green · Stokes · Gauss</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PRIMARY WORKSPACE NAVIGATION TABS ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin border-b border-[#14264c]">
        {[
          { id: 'overview', label: '1. Roadmap', icon: Navigation },
          { id: 'coordinates', label: '2. 3D Coordinates', icon: Globe },
          { id: 'surfaces', label: '3. 3D Surfaces', icon: Layers },
          { id: 'level_curves', label: '4. Contour Maps', icon: Grid },
          { id: 'limits_continuity', label: '5. Limits in 2D', icon: LineChart },
          { id: 'partials', label: '6. Partial Derivatives', icon: Sliders },
          { id: 'gradient', label: '7. Gradient & Ascent', icon: Compass },
          { id: 'tangent_planes', label: '8. Tangent Planes', icon: Layers },
          { id: 'optimization', label: '9. Extrema & Hessian', icon: Target },
          { id: 'lagrange', label: '10. Lagrange Multipliers', icon: Sparkles },
          { id: 'integrals', label: '11. Double/Triple Integrals', icon: FileText },
          { id: 'vector_calculus', label: '12. Vector Theorems', icon: Activity },
          { id: 'solver', label: '13. Interactive Solver', icon: Keyboard },
          { id: 'decision_tree', label: '14. Decision Tree', icon: HelpCircle },
          { id: 'quiz', label: '15. Practice Quiz', icon: CheckCircle2 },
          { id: 'formulas', label: '16. Formula Library', icon: BookOpen }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as MainTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-[#081226] text-slate-300 hover:text-white hover:bg-[#0d1e40] border border-[#14264c]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: OVERVIEW & ROADMAP ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">The Multivariable Calculus Learning Journey</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              In single-variable calculus, functions map a line to a line: <span className="text-blue-300 font-mono">y = f(x)</span>. In multivariable calculus, inputs are coordinate points, surfaces, and vector flows in 2D and 3D space: <span className="text-cyan-300 font-mono">z = f(x, y)</span> and <span className="text-amber-300 font-mono">F(x, y, z)</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: 'Level 1',
                  title: 'Space & Coordinates',
                  desc: 'Cartesian (x, y, z), Cylindrical (r, θ, z), and Spherical (ρ, θ, φ) geometries.',
                  tag: 'Geometry'
                },
                {
                  step: 'Level 2',
                  title: 'Functions & Surfaces',
                  desc: 'Visualizing z = f(x, y), level curves, contour lines, and multi-directional limits.',
                  tag: 'Surfaces'
                },
                {
                  step: 'Level 3',
                  title: 'Partial Derivatives',
                  desc: 'Slope along x with y fixed (∂f/∂x), slope along y with x fixed (∂f/∂y), and Clairaut equality.',
                  tag: 'Derivatives'
                },
                {
                  step: 'Level 4',
                  title: 'Gradient & Directional',
                  desc: '∇f points to steepest ascent; D_u f = ∇f · u computes rate along any compass angle.',
                  tag: 'Vectors'
                },
                {
                  step: 'Level 5',
                  title: 'Tangent Planes & Extrema',
                  desc: 'Linear approximations, Hessian discriminant D = f_xx f_yy - f_xy² for min, max, and saddles.',
                  tag: 'Optimization'
                },
                {
                  step: 'Level 6',
                  title: 'Lagrange Multipliers',
                  desc: 'Finding constrained optimums on curves and surfaces where ∇f is parallel to ∇g.',
                  tag: 'Constraints'
                },
                {
                  step: 'Level 7',
                  title: 'Multiple Integrals',
                  desc: 'Double integrals for volume, polar coordinates with Jacobian r dr dθ, and triple integrals.',
                  tag: 'Integration'
                },
                {
                  step: 'Level 8',
                  title: 'Vector Field Theorems',
                  desc: 'Divergence (flux expansion), Curl (swirl rotation), Green’s, Stokes’, and Gauss Theorems.',
                  tag: 'Theorems'
                }
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
                  <div>
                    <div className="flex items-center justify-between text-xs text-blue-400 font-mono mb-2">
                      <span>{item.step}</span>
                      <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-[10px]">
                        {item.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (idx === 0) setActiveTab('coordinates');
                      else if (idx === 1) setActiveTab('surfaces');
                      else if (idx === 2) setActiveTab('partials');
                      else if (idx === 3) setActiveTab('gradient');
                      else if (idx === 4) setActiveTab('tangent_planes');
                      else if (idx === 5) setActiveTab('lagrange');
                      else if (idx === 6) setActiveTab('integrals');
                      else setActiveTab('vector_calculus');
                    }}
                    className="mt-4 flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Open Topic <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Core Comparison: 1D vs Multivariable */}
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h3 className="text-base font-semibold text-white mb-4">Single-Variable vs Multivariable Calculus Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0b162f] text-slate-200 border-b border-[#162c57]">
                  <tr>
                    <th className="py-2.5 px-4 font-medium">Concept</th>
                    <th className="py-2.5 px-4 font-medium text-cyan-300">Single Variable (1D)</th>
                    <th className="py-2.5 px-4 font-medium text-blue-300">Multivariable (2D & 3D)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#132244]">
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-white">Function Input</td>
                    <td className="py-2.5 px-4 font-mono text-cyan-200">y = f(x)</td>
                    <td className="py-2.5 px-4 font-mono text-blue-200">z = f(x, y) or w = f(x, y, z)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-white">Approaching a Limit</td>
                    <td className="py-2.5 px-4">Only 2 directions: left (x→a⁻) and right (x→a⁺)</td>
                    <td className="py-2.5 px-4">Infinitely many paths (straight lines, parabolas, spirals)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-white">Derivative / Rate</td>
                    <td className="py-2.5 px-4 font-mono text-cyan-200">dy/dx (one slope)</td>
                    <td className="py-2.5 px-4 font-mono text-blue-200">∂f/∂x, ∂f/∂y and directional D_u f</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-white">Linear Approximation</td>
                    <td className="py-2.5 px-4">Tangent Line: y - y₀ = m(x - x₀)</td>
                    <td className="py-2.5 px-4">Tangent Plane: z - z₀ = f_x(x - x₀) + f_y(y - y₀)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-white">Second Derivative Test</td>
                    <td className="py-2.5 px-4 font-mono">f''(x) &gt; 0 (min), f''(x) &lt; 0 (max)</td>
                    <td className="py-2.5 px-4 font-mono">Hessian D = f_xx f_yy - (f_xy)² + saddle points</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-semibold text-white">Integral & Accumulation</td>
                    <td className="py-2.5 px-4">∫ f(x) dx (area under curve)</td>
                    <td className="py-2.5 px-4">∬ f(x,y) dA (volume under surface), ∭ dV (mass)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: 3D COORDINATES ─── */}
      {activeTab === 'coordinates' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">3D Coordinate Systems Visualizer</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              In three dimensions, points can be located via rectangular grids (Cartesian), circular cylinders (Cylindrical), or radial spheres (Spherical). Adjust the sliders to see automatic instant conversions.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sliders Input */}
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  Cartesian Coordinates (x, y, z)
                </h3>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>X coordinate</span>
                    <span className="font-mono text-cyan-300">{coordX.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={coordX}
                    onChange={(e) => setCoordX(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Y coordinate</span>
                    <span className="font-mono text-cyan-300">{coordY.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={coordY}
                    onChange={(e) => setCoordY(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Z coordinate (height)</span>
                    <span className="font-mono text-cyan-300">{coordZ.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="-5"
                    max="5"
                    step="0.1"
                    value={coordZ}
                    onChange={(e) => setCoordZ(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="pt-2 border-t border-[#14264c] text-[11px] text-slate-400">
                  Cartesian Point: <span className="font-mono text-white">({coordX}, {coordY}, {coordZ})</span>
                </div>
              </div>

              {/* Cylindrical Coordinates Card */}
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-cyan-300">Cylindrical Coordinates</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-mono">
                      (r, θ, z)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Best for problems with rotational symmetry around the z-axis (pipes, cylinders, rotating disks).
                  </p>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="bg-[#07122a] p-2.5 rounded-lg border border-[#14264c] flex justify-between">
                      <span className="text-slate-400">Radius r = √(x² + y²):</span>
                      <span className="text-cyan-300 font-semibold">{cylindricalCoords.r}</span>
                    </div>
                    <div className="bg-[#07122a] p-2.5 rounded-lg border border-[#14264c] flex justify-between">
                      <span className="text-slate-400">Angle θ = atan2(y, x):</span>
                      <span className="text-cyan-300 font-semibold">{cylindricalCoords.thetaDeg}° ({cylindricalCoords.thetaRad} rad)</span>
                    </div>
                    <div className="bg-[#07122a] p-2.5 rounded-lg border border-[#14264c] flex justify-between">
                      <span className="text-slate-400">Height z:</span>
                      <span className="text-cyan-300 font-semibold">{cylindricalCoords.z}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#14264c] text-[11px] text-slate-400">
                  Area element: <span className="font-mono text-cyan-300">dV = r dr dθ dz</span>
                </div>
              </div>

              {/* Spherical Coordinates Card */}
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-emerald-300">Spherical Coordinates</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 font-mono">
                      (ρ, θ, φ)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Best for spherical symmetry (planets, gravitational fields, electric point charges).
                  </p>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="bg-[#07122a] p-2.5 rounded-lg border border-[#14264c] flex justify-between">
                      <span className="text-slate-400">Distance ρ = √(x²+y²+z²):</span>
                      <span className="text-emerald-300 font-semibold">{sphericalCoords.rho}</span>
                    </div>
                    <div className="bg-[#07122a] p-2.5 rounded-lg border border-[#14264c] flex justify-between">
                      <span className="text-slate-400">Azimuthal θ:</span>
                      <span className="text-emerald-300 font-semibold">{sphericalCoords.thetaDeg}°</span>
                    </div>
                    <div className="bg-[#07122a] p-2.5 rounded-lg border border-[#14264c] flex justify-between">
                      <span className="text-slate-400">Polar angle φ = acos(z/ρ):</span>
                      <span className="text-emerald-300 font-semibold">{sphericalCoords.phiDeg}° ({sphericalCoords.phiRad} rad)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#14264c] text-[11px] text-slate-400">
                  Volume element: <span className="font-mono text-emerald-300">dV = ρ² sin(φ) dρ dφ dθ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: 3D SURFACES EXPLORER ─── */}
      {activeTab === 'surfaces' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">3D Surface Geometry Simulator</h2>
                <p className="text-xs text-slate-300">
                  Rotate the camera angle, select standard surfaces, and move the probe point to inspect coordinates.
                </p>
              </div>

              {/* Surface Presets */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'paraboloid', label: 'Paraboloid: x² + y²' },
                  { id: 'saddle', label: 'Saddle: x² - y²' },
                  { id: 'waves', label: 'Wave: sin(x)cos(y)' },
                  { id: 'plane', label: 'Plane: 0.4x + 0.3y' },
                  { id: 'cone', label: 'Cone: √(x²+y²)' }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSurfacePreset(preset.id as typeof surfacePreset)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      surfacePreset === preset.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#0b162f] text-slate-300 hover:text-white border border-[#162c57]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 3D SVG Projection Screen */}
              <div className="lg:col-span-3 bg-[#050b18] border border-[#14264c] rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[380px]">
                <svg viewBox="0 0 400 320" className="w-full max-w-xl h-auto drop-shadow-lg">
                  {/* Coordinate Axes */}
                  {(() => {
                    const origin = project3D(0, 0, 0, rotAngle, elevation);
                    const xAxis = project3D(3.2, 0, 0, rotAngle, elevation);
                    const yAxis = project3D(0, 3.2, 0, rotAngle, elevation);
                    const zAxis = project3D(0, 0, 3.2, rotAngle, elevation);

                    return (
                      <g strokeWidth="1.5">
                        {/* X-axis */}
                        <line
                          x1={origin.screenX}
                          y1={origin.screenY}
                          x2={xAxis.screenX}
                          y2={xAxis.screenY}
                          stroke="#f87171"
                          strokeDasharray="4 2"
                        />
                        <text x={xAxis.screenX + 4} y={xAxis.screenY} fill="#f87171" fontSize="10" fontWeight="bold">
                          +X
                        </text>

                        {/* Y-axis */}
                        <line
                          x1={origin.screenX}
                          y1={origin.screenY}
                          x2={yAxis.screenX}
                          y2={yAxis.screenY}
                          stroke="#4ade80"
                          strokeDasharray="4 2"
                        />
                        <text x={yAxis.screenX + 4} y={yAxis.screenY} fill="#4ade80" fontSize="10" fontWeight="bold">
                          +Y
                        </text>

                        {/* Z-axis */}
                        <line
                          x1={origin.screenX}
                          y1={origin.screenY}
                          x2={zAxis.screenX}
                          y2={zAxis.screenY}
                          stroke="#60a5fa"
                        />
                        <text x={zAxis.screenX} y={zAxis.screenY - 6} fill="#60a5fa" fontSize="10" fontWeight="bold">
                          +Z
                        </text>
                      </g>
                    );
                  })()}

                  {/* Surface Wireframe Mesh */}
                  {surfaceMesh.map((line, idx) => (
                    <path key={idx} d={line.path} fill="none" stroke={line.stroke} strokeWidth="1.2" />
                  ))}

                  {/* Interactive Probe Point on 3D Surface */}
                  <g>
                    <circle
                      cx={probeProjected.screenX}
                      cy={probeProjected.screenY}
                      r="6"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <line
                      x1={probeProjected.screenX}
                      y1={probeProjected.screenY}
                      x2={project3D(probeX, probeY, 0, rotAngle, elevation).screenX}
                      y2={project3D(probeX, probeY, 0, rotAngle, elevation).screenY}
                      stroke="#f59e0b"
                      strokeDasharray="2 2"
                      strokeWidth="1"
                    />
                  </g>
                </svg>

                {/* Floating probe coordinate label */}
                <div className="absolute bottom-3 left-3 bg-[#081226]/90 border border-blue-900/50 rounded-lg p-2.5 text-xs font-mono">
                  <div className="text-amber-400 font-semibold mb-0.5">● Probe Point:</div>
                  <div className="text-slate-300">
                    x: {probeX.toFixed(2)}, y: {probeY.toFixed(2)} ⇒ <span className="text-cyan-300">z = {probeProjected.z}</span>
                  </div>
                </div>
              </div>

              {/* Controls Column */}
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-400">Camera & Controls</h3>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Yaw Rotation</span>
                    <span className="font-mono text-blue-300">{rotAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotAngle}
                    onChange={(e) => setRotAngle(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs text-slate-300 mb-1">
                    <span>Elevation Pitch</span>
                    <span className="font-mono text-blue-300">{elevation}°</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="85"
                    value={elevation}
                    onChange={(e) => setElevation(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer"
                  />
                </div>

                <div className="pt-3 border-t border-[#162c57]">
                  <h4 className="text-xs font-semibold text-slate-200 mb-2">Probe Position</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Probe X</span>
                        <span className="font-mono text-amber-300">{probeX.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={probeX}
                        onChange={(e) => setProbeX(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Probe Y</span>
                        <span className="font-mono text-amber-300">{probeY.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={probeY}
                        onChange={(e) => setProbeY(parseFloat(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#162c57] text-[11px] text-slate-400 leading-relaxed">
                  Notice how every (x, y) input pair maps to an altitude z on the surface sheet.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 4: LEVEL CURVES & CONTOUR MAPS ─── */}
      {activeTab === 'level_curves' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Level Curves & Topographical Contour Maps</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              A level curve is the set of all points <span className="font-mono text-cyan-300">(x, y)</span> where the surface has a constant height <span className="font-mono text-amber-300">f(x, y) = c</span>. Just like hiking maps, close contour lines represent steep cliffs, and the gradient vector is always strictly perpendicular to the level curves!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interactive Slicing Plane Visualizer */}
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Interactive Slicing Plane: z = c</h3>
                    <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
                      c = {sliceLevel.toFixed(2)}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.2"
                    max="3.5"
                    step="0.1"
                    value={sliceLevel}
                    onChange={(e) => setSliceLevel(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer mb-4"
                  />

                  {/* 2D Contour Canvas */}
                  <div className="bg-[#050b18] border border-[#14264c] rounded-xl p-4 flex items-center justify-center">
                    <svg viewBox="-120 -120 240 240" className="w-56 h-56">
                      {/* Grid axes */}
                      <line x1="-110" y1="0" x2="110" y2="0" stroke="#1f2937" strokeWidth="1.5" />
                      <line x1="0" y1="-110" x2="0" y2="110" stroke="#1f2937" strokeWidth="1.5" />
                      <text x="95" y="14" fill="#64748b" fontSize="9">X</text>
                      <text x="6" y="-95" fill="#64748b" fontSize="9">Y</text>

                      {/* Static contour rings for paraboloid: x² + y² = 2z */}
                      {[0.5, 1.0, 1.5, 2.0, 2.5, 3.0].map((c) => {
                        const radius = Math.sqrt(c * 2) * 35;
                        const isCurrent = Math.abs(c - sliceLevel) < 0.25;
                        return (
                          <circle
                            key={c}
                            cx="0"
                            cy="0"
                            r={radius}
                            fill="none"
                            stroke={isCurrent ? '#f59e0b' : '#38bdf8'}
                            strokeWidth={isCurrent ? '2.5' : '1'}
                            strokeOpacity={isCurrent ? 1 : 0.4}
                          />
                        );
                      })}

                      {/* Active Slice Ring */}
                      <circle
                        cx="0"
                        cy="0"
                        r={Math.sqrt(Math.max(0.1, sliceLevel) * 2) * 35}
                        fill="rgba(245, 158, 11, 0.08)"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                      />

                      {/* Normal Gradient Vector pointing outwards */}
                      {(() => {
                        const r = Math.sqrt(Math.max(0.1, sliceLevel) * 2) * 35;
                        const px = r * Math.cos(Math.PI / 4);
                        const py = -r * Math.sin(Math.PI / 4);
                        const vx = px + 25 * Math.cos(Math.PI / 4);
                        const vy = py - 25 * Math.sin(Math.PI / 4);
                        return (
                          <g>
                            <circle cx={px} cy={py} r="3" fill="#f59e0b" />
                            <line x1={px} y1={py} x2={vx} y2={vy} stroke="#ec4899" strokeWidth="2" markerEnd="url(#arrow)" />
                            <text x={vx + 4} y={vy - 2} fill="#ec4899" fontSize="9" fontWeight="bold">∇f (Perpendicular)</text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                <div className="mt-4 text-xs text-slate-300 leading-relaxed">
                  For the circular paraboloid <span className="font-mono text-cyan-300">z = 0.5(x² + y²)</span>, horizontal slices at height <span className="font-mono text-amber-300">z = {sliceLevel.toFixed(1)}</span> produce circles of radius <span className="font-mono text-white">r = √(2c) = {Math.sqrt(2 * sliceLevel).toFixed(2)}</span>.
                </div>
              </div>

              {/* Geometric Insight Card */}
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Key Properties of Level Curves</h3>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <div className="text-xs font-semibold text-pink-400 mb-1">1. Gradient is Orthogonal to Level Curves</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      If you walk along a level curve, your altitude does NOT change: <span className="font-mono">df = ∇f · dr = 0</span>. Therefore, <span className="font-mono text-pink-300">∇f</span> is strictly perpendicular (normal) to the tangent of the level curve at every point.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <div className="text-xs font-semibold text-cyan-400 mb-1">2. Spacing Indicates Slope Steepness</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      When level curves are tightly packed together, the altitude changes rapidly over a short horizontal distance — indicating a steep slope. Wide spacing indicates a gentle, flat grade.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <div className="text-xs font-semibold text-emerald-400 mb-1">3. Level Surfaces in 3D: f(x, y, z) = k</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      For functions of three variables, holding the function constant creates a 3D surface (e.g. isotherms of equal temperature in a room or equipotential shells around an electrical charge).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 5: LIMITS & CONTINUITY IN 2D ─── */}
      {activeTab === 'limits_continuity' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Multivariable Limits: Why 2D Limits are Different</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              In single-variable calculus, you only test 2 directions: approaching from the left <span className="font-mono">x→a⁻</span> or from the right <span className="font-mono">x→a⁺</span>. In multivariable space, there are <strong>infinitely many approach trajectories</strong>: lines, parabolas, and spirals!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-rose-300">Classic Counterexample: The Two-Path Test</h3>
                <div className="bg-[#07122a] p-3 rounded-lg border border-[#14264c] font-mono text-xs text-center text-cyan-300">
                  {"lim[(x, y) → (0, 0)]  (2·x·y) / (x² + y²)"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Let us test approaching the origin <span className="font-mono">(0, 0)</span> along straight lines of slope m: <span className="font-mono text-amber-300">y = m·x</span>.
                </p>

                <div className="p-3 rounded-lg bg-[#081226] border border-[#14264c] space-y-2 text-xs font-mono">
                  <div className="text-slate-400">Substitute y = m·x:</div>
                  <div className="text-white">{"f(x, mx) = (2·x·(mx)) / (x² + m²x²)"}</div>
                  <div className="text-white">{"= (2m · x²) / (x²(1 + m²)) = 2m / (1 + m²)"}</div>
                  <div className="text-rose-400 pt-1 border-t border-[#14264c]">
                    If m = 1 (line y=x): limit = 2(1)/(1+1) = 1<br />
                    If m = 0 (line y=0): limit = 0/(1+0) = 0<br />
                    If m = -1 (line y=-x): limit = -2/2 = -1
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-xs text-rose-200">
                  <strong>Conclusion:</strong> Since approaching along line y = x gives 1, but approaching along y = 0 gives 0, the limit <strong>DOES NOT EXIST (D.N.E.)</strong>!
                </div>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-blue-300">How to Prove a Multivariable Limit DOES Exist</h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <div className="text-xs font-semibold text-cyan-300 mb-1">1. Direct Substitution</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      If the function is a polynomial or composed of continuous terms without zero denominators, simply plug in <span className="font-mono">(x₀, y₀)</span>.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <div className="text-xs font-semibold text-emerald-300 mb-1">2. Polar Coordinates Substitution</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Substitute <span className="font-mono">x = r cos θ</span> and <span className="font-mono">y = r sin θ</span>. As <span className="font-mono">(x,y) → (0,0)</span>, <span className="font-mono">r → 0</span>. If the resulting limit depends only on r and approaches a number independently of θ, the limit exists!
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <div className="text-xs font-semibold text-amber-300 mb-1">3. The Squeeze (Sandwich) Theorem</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Bound your function between two expressions <span className="font-mono">g(x, y) ≤ f(x, y) ≤ h(x, y)</span> that both converge to the same value L at <span className="font-mono">(x₀, y₀)</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 6: PARTIAL DERIVATIVES & CLAIRAUT ─── */}
      {activeTab === 'partials' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Partial Derivatives: Slicing the Surface</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              When calculating <span className="font-mono text-cyan-300">∂f/∂x</span>, we hold y fixed as a constant number. Geometrically, this is like slicing the 3D surface with a vertical plane parallel to the x-axis and measuring the 2D slope!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">First-Order Partials Example</h3>
                <div className="bg-[#07122a] p-3 rounded-lg border border-[#14264c] font-mono text-xs text-cyan-300">
                  {"f(x, y) = x³ · y² + 5 · x · y - 4 · y³"}
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#081226] border border-[#14264c]">
                    <div className="text-cyan-400 font-semibold mb-1">∂f/∂x (Holding y constant):</div>
                    <div className="text-slate-300">{"d/dx[x³ y²] + d/dx[5xy] - d/dx[4y³]"}</div>
                    <div className="text-white font-bold mt-1">{"= 3x² · y² + 5y - 0"}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#081226] border border-[#14264c]">
                    <div className="text-blue-400 font-semibold mb-1">∂f/∂y (Holding x constant):</div>
                    <div className="text-slate-300">{"d/dy[x³ y²] + d/dy[5xy] - d/dy[4y³]"}</div>
                    <div className="text-white font-bold mt-1">{"= 2x³ · y + 5x - 12y²"}</div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-amber-300">Clairaut’s Theorem: Equality of Mixed Partials</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Does the order in which we take partial derivatives matter? <br />
                  For almost all physical, continuous functions: <strong>NO!</strong>
                </p>

                <div className="p-3 rounded-lg bg-[#081226] border border-[#14264c] space-y-2 text-xs font-mono">
                  <div className="text-slate-400">Compute f_xy = ∂/∂y (∂f/∂x):</div>
                  <div className="text-white">{"∂/∂y [3x² y² + 5y] = 6x² y + 5"}</div>

                  <div className="text-slate-400 pt-2 border-t border-[#14264c]">Compute f_yx = ∂/∂x (∂f/∂y):</div>
                  <div className="text-white">{"∂/∂x [2x³ y + 5x - 12y²] = 6x² y + 5"}</div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs text-emerald-200">
                  <strong>Clairaut Equality Verified:</strong> <span className="font-mono">f_xy = f_yx = 6x²y + 5</span>.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 7: GRADIENT & DIRECTIONAL DERIVATIVE ─── */}
      {activeTab === 'gradient' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Gradient Vector & Directional Derivative Compass</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              The gradient <span className="font-mono text-cyan-300">∇f = ⟨f_x, f_y⟩</span> points in the direction of steepest ascent. The directional derivative <span className="font-mono text-amber-300">D_u f = ∇f · u</span> measures your rate of ascent along any chosen angle θ.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compass Angle Controller */}
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white">Choose Travel Direction Angle θ</h3>
                    <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                      θ = {compassAngleDeg}°
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={compassAngleDeg}
                    onChange={(e) => setCompassAngleDeg(parseInt(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer mb-5"
                  />

                  {/* 2D Compass Visualizer */}
                  <div className="bg-[#050b18] border border-[#14264c] rounded-xl p-4 flex items-center justify-center">
                    <svg viewBox="-100 -100 200 200" className="w-52 h-52">
                      <circle cx="0" cy="0" r="80" fill="none" stroke="#1f2937" strokeWidth="1.5" />
                      <circle cx="0" cy="0" r="40" fill="none" stroke="#1f2937" strokeWidth="1" strokeDasharray="3 3" />

                      {/* Cardinal labels */}
                      <text x="0" y="-85" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">N (90°)</text>
                      <text x="88" y="3" textAnchor="start" fill="#64748b" fontSize="9" fontWeight="bold">E (0°)</text>
                      <text x="0" y="93" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="bold">S (270°)</text>
                      <text x="-88" y="3" textAnchor="end" fill="#64748b" fontSize="9" fontWeight="bold">W (180°)</text>

                      {/* Gradient Vector (Fixed direction of steepest ascent) */}
                      {(() => {
                        const angleRad = (directionalDerivInfo.gradAngleDeg * Math.PI) / 180;
                        const gx = 70 * Math.cos(angleRad);
                        const gy = -70 * Math.sin(angleRad);
                        return (
                          <g>
                            <line x1="0" y1="0" x2={gx} y2={gy} stroke="#38bdf8" strokeWidth="3" />
                            <circle cx={gx} cy={gy} r="4" fill="#38bdf8" />
                            <text x={gx + 5} y={gy} fill="#38bdf8" fontSize="9" fontWeight="bold">∇f (Steepest)</text>
                          </g>
                        );
                      })()}

                      {/* User Direction Unit Vector u */}
                      {(() => {
                        const uRad = (compassAngleDeg * Math.PI) / 180;
                        const ux = 65 * Math.cos(uRad);
                        const uy = -65 * Math.sin(uRad);
                        return (
                          <g>
                            <line x1="0" y1="0" x2={ux} y2={uy} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="3 2" />
                            <circle cx={ux} cy={uy} r="4" fill="#f59e0b" />
                            <text x={ux + 5} y={uy + 4} fill="#f59e0b" fontSize="9" fontWeight="bold">u (Direction)</text>
                          </g>
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#14264c] text-xs font-mono text-slate-300 flex justify-between">
                  <span>Unit vector u:</span>
                  <span className="text-amber-300">⟨{directionalDerivInfo.ux}, {directionalDerivInfo.uy}⟩</span>
                </div>
              </div>

              {/* Mathematical Evaluation */}
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Evaluation on f(x, y) = x² + 2y² at (1, 1)</h3>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <div className="text-slate-400">Gradient Vector ∇f:</div>
                    <div className="text-cyan-300 font-semibold mt-1">
                      {"∇f = ⟨2x, 4y⟩ at (1, 1) = ⟨2, 4⟩"}
                    </div>
                    <div className="text-slate-400 mt-2">Maximum Rate of Ascent |∇f|:</div>
                    <div className="text-white font-bold mt-0.5">
                      {"|∇f| = √(2² + 4²) = √20 ≈ "} {directionalDerivInfo.gradMag}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <div className="text-slate-400">Directional Derivative D_u f = ∇f · u:</div>
                    <div className="text-white mt-1">
                      {"D_u f = (2)("} {directionalDerivInfo.ux} {") + (4)("} {directionalDerivInfo.uy} {")"}
                    </div>
                    <div className="text-amber-400 font-bold text-sm mt-1">
                      {"= "} {directionalDerivInfo.Du}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200 space-y-1">
                  <div><strong>Key Gradient Rules:</strong></div>
                  <div>• When u aligns with ∇f (θ = {directionalDerivInfo.gradAngleDeg}°): D_u f reaches its maximum (+{directionalDerivInfo.gradMag}).</div>
                  <div>• When u is perpendicular to ∇f: D_u f = 0 (walking along contour).</div>
                  <div>• When u opposes ∇f: D_u f reaches its minimum steep descent (-{directionalDerivInfo.gradMag}).</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 8: TANGENT PLANES & LINEAR APPROXIMATION ─── */}
      {activeTab === 'tangent_planes' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Tangent Planes & Local Linearization</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Just as a tangent line locally approximates a 1D curve <span className="font-mono">y = f(x)</span>, a flat <strong>tangent plane</strong> locally approximates a 3D curved surface <span className="font-mono">z = f(x, y)</span> near a point <span className="font-mono">(x₀, y₀)</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">The Tangent Plane Equation</h3>
                <div className="bg-[#07122a] p-3 rounded-lg border border-[#14264c] font-mono text-xs text-center text-cyan-300">
                  {"z - z₀ = f_x(x₀, y₀) · (x - x₀) + f_y(x₀, y₀) · (y - y₀)"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Notice that the normal vector to this plane is <span className="font-mono text-cyan-300">n = ⟨f_x, f_y, -1⟩</span>.
                </p>

                <div className="p-3 rounded-lg bg-[#081226] border border-[#14264c] space-y-2 text-xs font-mono">
                  <div className="text-amber-400 font-semibold">Worked Example:</div>
                  <div className="text-slate-300">Find the tangent plane to <span className="text-white">z = x² + 3xy</span> at (1, 2).</div>
                  <div className="text-slate-400 pt-1">1. Compute z₀: z₀ = 1² + 3(1)(2) = 7</div>
                  <div className="text-slate-400">2. f_x = 2x + 3y ⇒ f_x(1, 2) = 2(1) + 3(2) = 8</div>
                  <div className="text-slate-400">3. f_y = 3x ⇒ f_y(1, 2) = 3(1) = 3</div>
                  <div className="text-emerald-400 font-bold pt-1 border-t border-[#14264c]">
                    z - 7 = 8(x - 1) + 3(y - 2) ⇒ z = 8x + 3y - 7
                  </div>
                </div>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Total Differential: dz</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The total differential <span className="font-mono text-amber-300">dz</span> approximates the change in altitude <span className="font-mono">Δz</span> when moving by small increments <span className="font-mono">dx</span> and <span className="font-mono">dy</span>.
                </p>

                <div className="bg-[#07122a] p-3 rounded-lg border border-[#14264c] font-mono text-xs text-center text-amber-300">
                  {"dz = (∂f/∂x) dx + (∂f/∂y) dy"}
                </div>

                <div className="p-3 rounded-lg bg-[#081226] border border-[#14264c] text-xs text-slate-300 space-y-2">
                  <div className="text-xs font-semibold text-blue-300">Practical Application: Error Propagation</div>
                  <p className="leading-relaxed">
                    If an engineer measures length x with error ±Δx and width y with error ±Δy, the maximum estimated error in calculated surface area A(x, y) = xy is bounded by:
                  </p>
                  <div className="font-mono text-cyan-300 bg-[#07122a] p-2 rounded">
                    {"ΔA ≈ |y| · Δx + |x| · Δy"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 9: EXTREMA & SECOND DERIVATIVE TEST ─── */}
      {activeTab === 'optimization' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Multivariable Extrema & The Second Derivative Test</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              To find local maxima, minima, or saddle points of <span className="font-mono text-cyan-300">z = f(x, y)</span>, we find stationary points where the gradient vanishes <span className="font-mono text-amber-300">∇f = ⟨0, 0⟩</span>, and then classify them using the Hessian determinant <span className="font-mono text-emerald-300">D</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                  <span>Local Minimum</span>
                  <span className="font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">D &gt; 0, f_xx &gt; 0</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The surface curves upwards like a bowl in all directions. The point is lower than all neighboring points.
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-[#14264c]">
                  Example: z = x² + y² at (0, 0)
                </div>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
                  <span>Local Maximum</span>
                  <span className="font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">D &gt; 0, f_xx &lt; 0</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The surface curves downwards like an inverted dome. The point is higher than all neighboring points.
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-[#14264c]">
                  Example: z = -x² - y² at (0, 0)
                </div>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-rose-400">
                  <span>Saddle Point</span>
                  <span className="font-mono bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">D &lt; 0</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The surface curves upwards in one slice (like a horse saddle) and downwards in the perpendicular slice. Neither min nor max!
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-[#14264c]">
                  Example: z = x² - y² at (0, 0)
                </div>
              </div>
            </div>

            {/* Formula box for Hessian */}
            <div className="mt-6 bg-[#07122a] border border-[#14264c] rounded-xl p-4">
              <div className="text-xs font-semibold text-blue-400 mb-1">The Discriminant Formula (Hessian Determinant):</div>
              <div className="font-mono text-xs text-white">
                {"D = det [ f_xx  f_xy ; f_yx  f_yy ] = f_xx · f_yy - (f_xy)²"}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Note: If D = 0, the test is inconclusive (higher order Taylor expansions are required).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 10: LAGRANGE MULTIPLIERS ─── */}
      {activeTab === 'lagrange' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Lagrange Multipliers: Constrained Optimization</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              When optimizing an objective function <span className="font-mono text-cyan-300">f(x, y)</span> subject to a rigid constraint <span className="font-mono text-amber-300">g(x, y) = c</span>, the extreme values occur exactly where the level curve of f is tangent to the constraint curve!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">The Lagrange Condition</h3>
                <div className="bg-[#07122a] p-3 rounded-lg border border-[#14264c] font-mono text-xs text-center text-cyan-300">
                  {"∇f = λ · ∇g   and   g(x, y) = c"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Here, <span className="font-mono text-amber-300">λ (lambda)</span> is the Lagrange Multiplier. Since both gradient vectors are perpendicular to tangent curves that touch, the gradients must be parallel!
                </p>

                <div className="p-3 rounded-lg bg-[#081226] border border-[#14264c] space-y-2 text-xs font-mono">
                  <div className="text-amber-400 font-semibold">Standard 3-Step Recipe:</div>
                  <div className="text-slate-300">1. Set up gradient equations: f_x = λ g_x and f_y = λ g_y</div>
                  <div className="text-slate-300">2. Combine with constraint: g(x, y) = c</div>
                  <div className="text-slate-300">3. Solve system of 3 equations for x, y, and λ</div>
                </div>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Classic Problem: Maximize Rectangular Area</h3>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Maximize area <span className="font-mono text-cyan-300">f(x, y) = xy</span> subject to perimeter constraint <span className="font-mono text-amber-300">g(x, y) = 2x + 2y = 40</span> (or x + y = 20).
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="p-2.5 rounded bg-[#07122a] border border-[#14264c]">
                    {"∇f = ⟨y, x⟩  and  ∇g = ⟨1, 1⟩"}
                  </div>
                  <div className="p-2.5 rounded bg-[#07122a] border border-[#14264c]">
                    {"y = λ(1)  and  x = λ(1) ⇒ y = x"}
                  </div>
                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-emerald-300">
                    {"Substitute into constraint: x + x = 20 ⇒ x = 10, y = 10"}
                    <div className="text-white mt-1">Maximum Area = 10 · 10 = 100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 11: MULTIPLE INTEGRALS ─── */}
      {activeTab === 'integrals' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Double & Triple Integrals (Volume & Mass)</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              A single integral sums height along a 1D line to get area. A double integral sums pillars of height <span className="font-mono text-cyan-300">z = f(x, y)</span> over a 2D floor region <span className="font-mono text-white">R</span> to compute <strong>3D Volume</strong>!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">1. Cartesian (Fubini’s)</div>
                <div className="font-mono text-xs text-white bg-[#07122a] p-3 rounded-lg border border-[#14264c]">
                  {"∬_R f(x, y) dA = ∫_a^b ∫_c^d f(x, y) dy dx"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Fubini’s Theorem allows evaluating double integrals as iterated single integrals. If the region is rectangular, the integration order (dx dy vs dy dx) does not affect the answer!
                </p>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">2. Polar Coordinates (r, θ)</div>
                <div className="font-mono text-xs text-white bg-[#07122a] p-3 rounded-lg border border-[#14264c]">
                  {"∬ f(x, y) dA = ∬ f(r cos θ, r sin θ) · r dr dθ"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Never forget the Jacobian factor r!</strong> When transforming coordinates from Cartesian to polar, the area element expands to <span className="font-mono text-amber-300">dA = r dr dθ</span>.
                </p>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">3. Triple Integrals</div>
                <div className="font-mono text-xs text-white bg-[#07122a] p-3 rounded-lg border border-[#14264c]">
                  {"∭_E f(x, y, z) dV"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Used for computing mass of non-uniform solid bodies, center of mass, and moments of inertia. In spherical coords: <span className="font-mono text-emerald-300">dV = ρ² sin(φ) dρ dφ dθ</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 12: VECTOR CALCULUS & BIG THEOREMS ─── */}
      {activeTab === 'vector_calculus' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Vector Calculus & The Grand Integral Theorems</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Vector calculus connects fluid flows, electromagnetic fields, and forces. The three monumental theorems below generalize the Fundamental Theorem of Calculus to higher dimensions.
            </p>

            {/* Divergence vs Curl comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-cyan-300 mb-2">
                  <span>Divergence: ∇ · F (Flux Density)</span>
                  <span className="font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">Scalar</span>
                </div>
                <div className="font-mono text-xs text-white bg-[#07122a] p-2 rounded mb-2">
                  {"div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Measures whether fluid is expanding outward from a point (source &gt; 0) or draining inward (sink &lt; 0). If ∇ · F = 0, the field is incompressible.
                </p>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-300 mb-2">
                  <span>Curl: ∇ × F (Vorticity / Swirl)</span>
                  <span className="font-mono bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">Vector in 3D</span>
                </div>
                <div className="font-mono text-xs text-white bg-[#07122a] p-2 rounded mb-2">
                  {"curl F = ⟨Ry - Qz, Pz - Rx, Qx - Py⟩"}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Measures the rotation of a tiny paddle wheel placed in the fluid flow. If ∇ × F = 0, the vector field is irrotational and conservative (F = ∇f).
                </p>
              </div>
            </div>

            {/* The Big 3 Theorems */}
            <div className="space-y-4">
              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-emerald-400">Green’s Theorem (in the 2D Plane)</h3>
                  <span className="text-xs font-mono text-white bg-[#07122a] px-2.5 py-1 rounded border border-[#14264c]">
                    {"∮_C (P dx + Q dy) = ∬_D (∂Q/∂x - ∂P/∂y) dA"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Converts a closed boundary circulation loop into a 2D curl integral over the entire enclosed area.
                </p>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-cyan-400">Stokes’ Theorem (3D Surfaces with Boundary)</h3>
                  <span className="text-xs font-mono text-white bg-[#07122a] px-2.5 py-1 rounded border border-[#14264c]">
                    {"∮_C F · dr = ∬_S (curl F) · dS"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Relates work done by field F around a 3D boundary wire C to the flux of curl F piercing through any sheet surface S capped by C.
                </p>
              </div>

              <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-blue-400">The Divergence Theorem (Gauss’ Theorem)</h3>
                  <span className="text-xs font-mono text-white bg-[#07122a] px-2.5 py-1 rounded border border-[#14264c]">
                    {"∬_S F · dS = ∭_E (div F) dV"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The total outward flux leaking out through a closed 3D balloon S equals the integral of all interior microscopic source divergences throughout the volume E.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 13: INTERACTIVE MULTIVARIABLE SOLVER ─── */}
      {activeTab === 'solver' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Interactive Multivariable Calculator & Solver</h2>
                <p className="text-xs text-slate-300">
                  Enter any expression <span className="font-mono text-cyan-300">f(x, y)</span> to automatically compute partials, gradient vector, tangent plane equation, and Hessian classification.
                </p>
              </div>
              <button
                onClick={() => setShowKeyboard((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  showKeyboard
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#0b162f] text-slate-300 hover:text-white border-[#162c57]'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                {showKeyboard ? 'Hide Math Keyboard' : 'Show Math Keyboard'}
              </button>
            </div>

            {/* Expression Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Multivariable Expression: f(x, y)
                </label>
                <input
                  ref={activeInputRef}
                  type="text"
                  value={solverExpr}
                  onChange={(e) => setSolverExpr(e.target.value)}
                  className="w-full bg-[#050b18] border border-[#162c57] rounded-lg px-3 py-2 text-sm font-mono text-cyan-300 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. x^2 + 3*y^2 - 4*x - 6*y"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Point x₀</label>
                <input
                  type="text"
                  value={solverX0}
                  onChange={(e) => setSolverX0(e.target.value)}
                  className="w-full bg-[#050b18] border border-[#162c57] rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Point y₀</label>
                <input
                  type="text"
                  value={solverY0}
                  onChange={(e) => setSolverY0(e.target.value)}
                  className="w-full bg-[#050b18] border border-[#162c57] rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Presets Row */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-slate-400">Presets:</span>
              {[
                { label: 'Minimum Bowl: x² + 3y² - 4x - 6y', expr: 'x^2 + 3*y^2 - 4*x - 6*y', x: '2', y: '1' },
                { label: 'Saddle: x² - y²', expr: 'x^2 - y^2', x: '0', y: '0' },
                { label: 'Cubic Saddle: x³ - 3x + y²', expr: 'x^3 - 3*x + y^2', x: '1', y: '0' },
                { label: 'Max Inverted: 10 - x² - y²', expr: '10 - x^2 - y^2', x: '0', y: '0' }
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSolverExpr(p.expr);
                    setSolverX0(p.x);
                    setSolverY0(p.y);
                  }}
                  className="px-2.5 py-1 rounded bg-[#0b162f] hover:bg-[#13254b] border border-[#162c57] text-[11px] text-slate-300 hover:text-white transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Results Grid */}
            {solverAnalysis.success ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                    <div className="text-xs text-slate-400">Altitude z₀ = f(x₀, y₀)</div>
                    <div className="text-xl font-bold text-cyan-300 font-mono mt-1">
                      {solverAnalysis.fVal}
                    </div>
                  </div>

                  <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                    <div className="text-xs text-slate-400">Gradient ∇f(x₀, y₀)</div>
                    <div className="text-xl font-bold text-blue-300 font-mono mt-1">
                      ⟨{solverAnalysis.fxVal}, {solverAnalysis.fyVal}⟩
                    </div>
                  </div>

                  <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                    <div className="text-xs text-slate-400">Hessian Determinant D</div>
                    <div className="text-xl font-bold text-emerald-300 font-mono mt-1">
                      {solverAnalysis.discriminant}
                    </div>
                  </div>

                  <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4">
                    <div className="text-xs text-slate-400">Stationary Status</div>
                    <div className={`text-sm font-semibold mt-1 ${solverAnalysis.isStationary ? 'text-amber-400' : 'text-slate-300'}`}>
                      {solverAnalysis.isStationary ? '∇f = 0 (Critical Point)' : 'Non-Critical (Sloped)'}
                    </div>
                  </div>
                </div>

                {/* Analytical Steps */}
                <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-3 font-mono text-xs">
                  <div className="text-xs font-semibold text-white uppercase tracking-wider font-sans mb-2">
                    Step-by-Step Analytical Derivations
                  </div>

                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <span className="text-slate-400">1. Partial Derivatives:</span>
                    <div className="text-cyan-300 mt-1">∂f/∂x = {solverAnalysis.fxStr} ⇒ ∂f/∂x({solverX0}, {solverY0}) = {solverAnalysis.fxVal}</div>
                    <div className="text-blue-300 mt-1">∂f/∂y = {solverAnalysis.fyStr} ⇒ ∂f/∂y({solverX0}, {solverY0}) = {solverAnalysis.fyVal}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <span className="text-slate-400">2. Second-Order Mixed Partials:</span>
                    <div className="text-slate-200 mt-1">f_xx = {solverAnalysis.fxxStr} = {solverAnalysis.fxxVal}</div>
                    <div className="text-slate-200 mt-1">f_yy = {solverAnalysis.fyyStr} = {solverAnalysis.fyyVal}</div>
                    <div className="text-slate-200 mt-1">f_xy = {solverAnalysis.fxyStr} = {solverAnalysis.fxyVal}</div>
                    <div className="text-emerald-300 mt-2 font-bold">
                      D = f_xx · f_yy - (f_xy)² = ({solverAnalysis.fxxVal})({solverAnalysis.fyyVal}) - ({solverAnalysis.fxyVal})² = {solverAnalysis.discriminant}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#07122a] border border-[#14264c]">
                    <span className="text-slate-400">3. Tangent Plane at ({solverX0}, {solverY0}):</span>
                    <div className="text-white font-bold mt-1">{solverAnalysis.tangentPlaneStr}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-800/40 font-sans text-xs text-blue-200">
                    <strong>Point Classification:</strong> {solverAnalysis.classification}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300">
                {solverAnalysis.error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 14: DECISION TREE ─── */}
      {activeTab === 'decision_tree' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Multivariable Problem Solver Decision Tree</h2>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Not sure which multivariable theorem or formula to apply? Choose your goal below to see the optimal method.
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'rate', label: 'Rate of change in a direction' },
                { id: 'max_min', label: 'Find Maxima / Minima (unconstrained)' },
                { id: 'constrained', label: 'Find Maxima with a constraint g(x,y)=c' },
                { id: 'plane', label: 'Find Tangent Plane or Linearization' },
                { id: 'volume', label: 'Calculate 3D Volume or Area' },
                { id: 'line_integral', label: 'Work along a 2D closed curve' },
                { id: 'flux_closed', label: 'Outward flux through closed 3D surface' }
              ].map((q) => (
                <button
                  key={q.id}
                  onClick={() => setDecisionQuery(q.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    decisionQuery === q.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#0b162f] text-slate-300 hover:text-white border border-[#162c57]'
                  }`}
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Decision Result Card */}
            <div className="bg-[#0b162f] border border-[#162c57] rounded-xl p-5 space-y-4">
              {decisionQuery === 'rate' && (
                <>
                  <div className="text-sm font-semibold text-cyan-300">Method: Directional Derivative D_u f = ∇f · u</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Compute gradient vector: <span className="font-mono text-cyan-200">∇f = ⟨f_x, f_y⟩</span>.<br />
                    2. Convert direction into a <strong>unit vector</strong>: <span className="font-mono text-white">u = v / |v|</span>.<br />
                    3. Compute dot product: <span className="font-mono text-cyan-200">D_u f = ∇f · u</span>.<br />
                    4. Note: If you want the maximum possible rate, simply calculate the magnitude <span className="font-mono text-amber-300">|∇f|</span> in the direction of <span className="font-mono">∇f</span> itself!
                  </p>
                </>
              )}

              {decisionQuery === 'max_min' && (
                <>
                  <div className="text-sm font-semibold text-emerald-300">Method: Stationary Points & Second Derivative Test</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Solve for critical points where <span className="font-mono text-white">f_x = 0</span> and <span className="font-mono text-white">f_y = 0</span>.<br />
                    2. Compute second partial derivatives <span className="font-mono text-white">f_xx, f_yy, f_xy</span>.<br />
                    3. Evaluate discriminant: <span className="font-mono text-emerald-300">D = f_xx f_yy - (f_xy)²</span>.<br />
                    4. If D &gt; 0 and f_xx &gt; 0 ⇒ Local Min. If D &gt; 0 and f_xx &lt; 0 ⇒ Local Max. If D &lt; 0 ⇒ Saddle Point.
                  </p>
                </>
              )}

              {decisionQuery === 'constrained' && (
                <>
                  <div className="text-sm font-semibold text-amber-300">Method: Method of Lagrange Multipliers</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Formulate constraint equation: <span className="font-mono text-white">g(x, y) = c</span>.<br />
                    2. Set gradient vectors parallel: <span className="font-mono text-amber-300">∇f = λ · ∇g</span>.<br />
                    3. Write the 3 scalar equations: <span className="font-mono text-white">f_x = λ g_x, f_y = λ g_y, and g(x, y) = c</span>.<br />
                    4. Solve for x, y, λ, and evaluate f(x, y) at each candidate point.
                  </p>
                </>
              )}

              {decisionQuery === 'plane' && (
                <>
                  <div className="text-sm font-semibold text-blue-300">Method: Tangent Plane Equation</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    1. Compute base altitude: <span className="font-mono text-white">z₀ = f(x₀, y₀)</span>.<br />
                    2. Evaluate partial slopes: <span className="font-mono text-cyan-300">f_x(x₀, y₀)</span> and <span className="font-mono text-cyan-300">f_y(x₀, y₀)</span>.<br />
                    3. Assemble plane formula: <span className="font-mono text-white">z - z₀ = f_x(x - x₀) + f_y(y - y₀)</span>.
                  </p>
                </>
              )}

              {decisionQuery === 'volume' && (
                <>
                  <div className="text-sm font-semibold text-cyan-300">Method: Double Integral in Cartesian or Polar Coords</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    • If region R is a rectangle: Use Cartesian <span className="font-mono text-white">∬ f(x,y) dx dy</span>.<br />
                    • If region R is circular or contains x² + y²: Convert to Polar <span className="font-mono text-amber-300">∬ f(r cos θ, r sin θ) r dr dθ</span>.
                  </p>
                </>
              )}

              {decisionQuery === 'line_integral' && (
                <>
                  <div className="text-sm font-semibold text-emerald-300">Method: Green’s Theorem</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instead of parametrizing the messy boundary curve C, convert the closed line integral <span className="font-mono text-white">∮_C P dx + Q dy</span> into a double area integral of 2D curl: <span className="font-mono text-emerald-300">∬_D (∂Q/∂x - ∂P/∂y) dA</span>.
                  </p>
                </>
              )}

              {decisionQuery === 'flux_closed' && (
                <>
                  <div className="text-sm font-semibold text-blue-300">Method: Divergence Theorem (Gauss’ Theorem)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Instead of computing 6 separate surface flux integrals over the faces of a cube or sphere, compute the triple volume integral of divergence: <span className="font-mono text-blue-300">∭_E (∇ · F) dV</span>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 15: PRACTICE QUIZ ─── */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Multivariable Calculus Mastery Quiz</h2>
                <p className="text-xs text-slate-300">
                  Test your understanding of gradients, partials, double integrals, and vector field theorems.
                </p>
              </div>
              {quizSubmitted && (
                <button
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b162f] border border-[#162c57] text-xs font-medium text-slate-300 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Quiz
                </button>
              )}
            </div>

            <div className="space-y-5">
              {QUIZ_QUESTIONS.map((q, qIdx) => {
                const selected = quizAnswers[q.id];
                const isCorrect = selected === q.correctIdx;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      quizSubmitted
                        ? isCorrect
                          ? 'bg-emerald-950/20 border-emerald-800/40'
                          : 'bg-rose-950/20 border-rose-800/40'
                        : 'bg-[#0b162f] border-[#162c57]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-sm font-medium text-white">
                        {qIdx + 1}. {q.question}
                      </h3>
                      {quizSubmitted && (
                        <div className="shrink-0">
                          {isCorrect ? (
                            <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                              <CheckCircle2 className="w-4 h-4" /> Correct
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs text-rose-400 font-medium">
                              <XCircle className="w-4 h-4" /> Incorrect
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => {
                        const isThisSelected = selected === optIdx;
                        const isThisCorrect = q.correctIdx === optIdx;

                        return (
                          <button
                            key={optIdx}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                              quizSubmitted
                                ? isThisCorrect
                                  ? 'bg-emerald-900/40 border border-emerald-600 text-emerald-200'
                                  : isThisSelected
                                  ? 'bg-rose-900/40 border border-rose-600 text-rose-200'
                                  : 'bg-[#07122a] text-slate-400 border border-transparent'
                                : isThisSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-[#07122a] text-slate-300 hover:text-white hover:bg-[#0c1c3f] border border-[#14264c]'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="mt-3 pt-3 border-t border-[#14264c] text-xs text-slate-300 leading-relaxed">
                        <strong className="text-white">Explanation: </strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted && (
              <div className="mt-6 flex justify-end">
                <button
                  disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
                  onClick={() => setQuizSubmitted(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all"
                >
                  Submit Quiz & Check Scores
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 16: FORMULA LIBRARY ─── */}
      {activeTab === 'formulas' && (
        <div className="space-y-6">
          <div className="bg-[#081226] border border-[#14264c] rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">Multivariable & Vector Calculus Formula Sheet</h2>
                <p className="text-xs text-slate-300">
                  Searchable equations and identities for exams, research, and engineering.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formulaSearch}
                  onChange={(e) => setFormulaSearch(e.target.value)}
                  placeholder="Search formulas or theorems..."
                  className="w-full bg-[#050b18] border border-[#162c57] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FORMULAS.filter(
                (f) =>
                  f.title.toLowerCase().includes(formulaSearch.toLowerCase()) ||
                  f.meaning.toLowerCase().includes(formulaSearch.toLowerCase()) ||
                  f.latex.toLowerCase().includes(formulaSearch.toLowerCase())
              ).map((f, idx) => (
                <div key={idx} className="bg-[#0b162f] border border-[#162c57] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-cyan-300 mb-2">{f.title}</h3>
                    <div className="bg-[#07122a] p-3 rounded-lg border border-[#14264c] font-mono text-xs text-white mb-2 overflow-x-auto">
                      {f.latex}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-[#14264c]">
                    {f.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── VIRTUAL MATH KEYBOARD PORTAL ─── */}
      <MathVirtualKeyboard
        isOpen={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onInsert={handleKeyboardInsert}
        onDelete={handleKeyboardDelete}
        onClear={handleKeyboardClear}
      />
    </div>
  );
}
