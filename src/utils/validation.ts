import { Customer } from '../types';

interface ValidationErrors {
  [key: string]: string;
}

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  if (cleanCPF.length !== 11) return false;
  
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
  }
  
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
  }
  
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cleanCPF.charAt(10))) return false;
  
  return true;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const validateCustomerForm = (data: Partial<Customer>): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Nome completo
  if (!data.fullName?.trim()) {
    errors.fullName = 'Nome completo é obrigatório';
  } else if (data.fullName.trim().length < 3) {
    errors.fullName = 'Nome deve ter pelo menos 3 caracteres';
  }

  // CPF
  if (data.documentType === 'cpf') {
    if (!data.documentNumber?.trim()) {
      errors.documentNumber = 'CPF é obrigatório';
    } else if (!validateCPF(data.documentNumber)) {
      errors.documentNumber = 'CPF inválido';
    }
  }

  // Data de nascimento
  if (!data.birthDate) {
    errors.birthDate = 'Data de nascimento é obrigatória';
  } else {
    const birthDate = new Date(data.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 18 || age > 120) {
      errors.birthDate = 'Data de nascimento inválida';
    }
  }

  // Telefone principal
  if (!data.phones?.primary) {
    errors.primaryPhone = 'Telefone principal é obrigatório';
  } else if (!validatePhone(data.phones.primary)) {
    errors.primaryPhone = 'Formato inválido. Use (99) 99999-9999';
  }

  // Email principal
  if (!data.emails?.primary) {
    errors.primaryEmail = 'Email principal é obrigatório';
  } else if (!validateEmail(data.emails.primary)) {
    errors.primaryEmail = 'Email inválido';
  }

  // Endereço
  if (!data.address?.zipCode?.trim()) {
    errors.zipCode = 'CEP é obrigatório';
  } else if (!/^\d{5}-\d{3}$/.test(data.address.zipCode)) {
    errors.zipCode = 'CEP inválido. Use 99999-999';
  }

  if (!data.address?.street?.trim()) {
    errors.street = 'Logradouro é obrigatório';
  }

  if (!data.address?.number?.trim()) {
    errors.number = 'Número é obrigatório';
  }

  if (!data.address?.neighborhood?.trim()) {
    errors.neighborhood = 'Bairro é obrigatório';
  }

  if (!data.address?.city?.trim()) {
    errors.city = 'Cidade é obrigatória';
  }

  if (!data.address?.state?.trim()) {
    errors.state = 'Estado é obrigatório';
  } else if (!/^[A-Z]{2}$/.test(data.address.state)) {
    errors.state = 'Use a sigla do estado (ex: SP)';
  }

  return errors;
};