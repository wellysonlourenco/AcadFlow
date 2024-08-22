import { AuthContext } from '@/context/AuthContext';
import { yupResolver } from '@hookform/resolvers/yup';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { red } from '@mui/material/colors';
import { ChangeEvent, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

type SignInData = {
  email: string;
  password: string;
};

const schema = yup.object({
  email: yup.string().email('Insira um e-mail válido!').required('E-mail obrigatório!'),
  password: yup.string().required('Informe sua senha!').min(8, 'Sua senha deve conter no mínimo 8 caracteres!'),
});

export default function SignIn() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const { register, handleSubmit, formState: { errors } } = useForm<SignInData>({ resolver: yupResolver(schema) });

  const handleLogin = async () => {
    if (email && password) {
      const isLogged = await auth.signin(email, password);
      
        navigate('/');
     
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Entrar no sistema
        </Typography>
        <Box component="form" onSubmit={handleSubmit(handleLogin)} noValidate sx={{ mt: 1 }}>
          <TextField
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Seu e-mail"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={handleEmailInput}
          />
          <TextField
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handlePasswordInput}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: error ? red[500] : undefined,
              '&:hover': {
                bgcolor: error ? red[700] : undefined,
              },
            }}
          >
            {error ? 'E-mail ou senha inválidos' : 'Entrar'}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid item>
              <Link href="SignUp" variant="body2">
                Ainda não possui uma conta?
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
