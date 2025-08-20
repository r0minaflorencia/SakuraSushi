import { useState, useCallback, useRef } from 'react';
import { formUtils } from '../utils/formUtils';
import { validationService } from '../services/contactService';

/**
 * Custom hook para manejar formularios con validación y estado
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación
 * @param {Function} onSubmit - Función a ejecutar al enviar el formulario
 * @returns {Object} - Estado y funciones para manejar el formulario
 */
const useForm = (initialValues = {}, validationRules = {}, onSubmit = () => {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const formRef = useRef(null);

  // Función para validar un campo específico
  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;
    
    return validationService.validateField(name, value, rules, values);
  }, [validationRules, values]);

  // Función para validar todos los campos
  const validateForm = useCallback(() => {
    const { errors: newErrors, isValid } = validationService.validateForm(values, validationRules);
    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  // Función para manejar cambios en los inputs
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = formUtils.getInputValue(type, value, checked);

    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Validar el campo si ya fue tocado
    if (touched[name]) {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  // Función para manejar blur (cuando el campo pierde el foco)
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, [validateField]);

  // Función para establecer el valor de un campo específico
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }, [touched, validateField]);

  // Función para establecer el error de un campo específico
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  // Función para marcar un campo como tocado
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  // Función para manejar el envío del formulario
  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    setSubmitCount(prev => prev + 1);
    
    // Marcar todos los campos como tocados
    const touchedFields = formUtils.markAllFieldsAsTouched(validationRules);
    setTouched(touchedFields);

    const isValid = validateForm();
    
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      if (error.fieldErrors) {
        setErrors(prev => ({
          ...prev,
          ...error.fieldErrors
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validationRules, validateForm, onSubmit]);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitCount(0);
    setIsSubmitting(false);
  }, [initialValues]);

  // Función para resetear solo los errores
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Función para obtener props de un campo específico
  const getFieldProps = useCallback((name) => ({
    name,
    value: values[name] || '',
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
    touched: touched[name]
  }), [values, errors, touched, handleChange, handleBlur]);

  // Función para verificar si el formulario es válido
  const isValid = useCallback(() => {
    return formUtils.isFormValid(errors, touched);
  }, [errors, touched]);

  // Función para verificar si el formulario tiene cambios
  const isDirty = useCallback(() => {
    return formUtils.isFormDirty(values, initialValues);
  }, [values, initialValues]);

  return {
    // Valores del formulario
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    
    // Referencias
    formRef,
    
    // Handlers principales
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Funciones de utilidad
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
    clearErrors,
    validateForm,
    validateField,
    getFieldProps,
    
    // Estado derivado
    isValid: isValid(),
    isDirty: isDirty(),
    hasErrors: Object.keys(errors).length > 0
  };
};

export default useForm;