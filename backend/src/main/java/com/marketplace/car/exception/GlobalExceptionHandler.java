package com.marketplace.car.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.net.URI;
import java.util.List;

/**
 * Global exception handler providing RFC 7807 structured ProblemDetail responses.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleResourceNotFoundException(
            ResourceNotFoundException ex, HttpServletRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND, ex.getMessage());
        problemDetail.setType(URI.create("about:blank"));
        problemDetail.setTitle("Not Found");
        problemDetail.setInstance(URI.create(request.getRequestURI()));

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problemDetail);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Invalid input parameters");
        problemDetail.setType(URI.create("about:blank"));
        problemDetail.setTitle("Bad Request");

        if (request instanceof ServletWebRequest servletWebRequest) {
            problemDetail.setInstance(URI.create(servletWebRequest.getRequest().getRequestURI()));
        }

        List<String> errors = ex.getBindingResult()
                .getAllErrors()
                .stream()
                .map(error -> {
                    if (error instanceof FieldError fieldError && fieldError.getDefaultMessage() != null) {
                        return fieldError.getDefaultMessage();
                    }
                    return error.getDefaultMessage() != null ? error.getDefaultMessage() : error.toString();
                })
                .sorted()
                .toList();

        problemDetail.setProperty("errors", errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problemDetail);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            HttpHeaders headers,
            HttpStatusCode status,
            WebRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Malformed JSON request or invalid parameter format");
        problemDetail.setType(URI.create("about:blank"));
        problemDetail.setTitle("Bad Request");

        if (request instanceof ServletWebRequest servletWebRequest) {
            problemDetail.setInstance(URI.create(servletWebRequest.getRequest().getRequestURI()));
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problemDetail);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ProblemDetail> handleConstraintViolation(
            ConstraintViolationException ex, HttpServletRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST, "Invalid input parameters");
        problemDetail.setType(URI.create("about:blank"));
        problemDetail.setTitle("Bad Request");
        problemDetail.setInstance(URI.create(request.getRequestURI()));

        List<String> errors = ex.getConstraintViolations()
                .stream()
                .map(ConstraintViolation::getMessage)
                .sorted()
                .toList();

        problemDetail.setProperty("errors", errors);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problemDetail);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ProblemDetail> handleMethodArgumentTypeMismatch(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                "Invalid value for parameter: " + ex.getName());
        problemDetail.setType(URI.create("about:blank"));
        problemDetail.setTitle("Bad Request");
        problemDetail.setInstance(URI.create(request.getRequestURI()));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problemDetail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleGeneralException(
            Exception ex, HttpServletRequest request) {
        ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
        problemDetail.setType(URI.create("about:blank"));
        problemDetail.setTitle("Internal Server Error");
        problemDetail.setInstance(URI.create(request.getRequestURI()));

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_PROBLEM_JSON)
                .body(problemDetail);
    }
}
