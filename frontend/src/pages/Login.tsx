import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure, clearError } from '../redux/authSlice';
import { loginAPI } from '../services/api';
import type { RootState } from '../redux/store';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const onSubmit = async (data: any) => {
    try {
      dispatch(loginStart());
      const response = await loginAPI(data.email, data.password);
      
      const userObj = {
        id: 1,
        full_name: data.email.split('@')[0],
        email: data.email,
      };
      
      dispatch(loginSuccess({ token: response.access_token, user: userObj }));
      navigate('/');
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || 'Failed to login. Please check your credentials.';
      dispatch(loginFailure(errMsg));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 select-none">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        
        <div className="flex flex-col items-center mb-6">
          <span className="text-slate-500 text-sm font-semibold tracking-wide mb-1">COVID-19</span>
          <h2 className="text-2xl font-bold text-slate-900">
            Welcome back
          </h2>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className={`w-full rounded-lg border bg-white py-2 px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all ${
                errors.email
                  ? 'border-rose-500 focus:border-rose-500'
                  : 'border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <span className="text-xs text-rose-500 mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full rounded-lg border bg-white py-2 pl-3 pr-10 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all ${
                  errors.password
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400/20'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-rose-500 mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-black hover:bg-slate-900 active:bg-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
};
