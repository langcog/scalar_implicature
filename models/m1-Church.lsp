(define (state-prior) (uniform-draw '(1 2 3 4 5))) ;;Switch with empircal priors
(define (sentence-prior) (uniform-draw (list all some)))

;; all  0.01 0.11 0.35 0.68 0.98 
;; some 0.16 0.36 0.68 0.83 0.83
(define (all state) (flip (list-elt (list 0.01 0.11 0.35 0.68 0.98) state)))
(define (some state) (flip (list-elt (list 0.16 0.36 0.68 0.83 0.83) state)))

(define (speaker state depth)
  (rejection-query
   (define words (sentence-prior))
   words
   (equal? state (listener words depth))))

(define (listener words depth)
  (rejection-query
   (define state (state-prior))
   state
   (if (= depth 0)
       (words state)
       (equal? words (speaker state (- depth 1))))))

(define depth 1)

(hist (repeat 300 (lambda () (listener some depth))))

(define boundedness

  ;;Scale Parameters
  ;;

;(define (state-prior) (uniform-draw '(0 1 2 3)))


;;; Work from ---> 5/5/15
;
;
;
;(define (state-prior) (uniform-draw '(1 2 3 4 5)))

(define (state-prior) (multinomial
                        '(1 2 3 4 5) '(0.003 0.053 0.403 0.387 0.150)))

(define (sentence-prior) (uniform-draw (list all some none)))

(define (all state) (= 5 state))
(define (some state) (< 1 state))
(define (none state) (= 1 state))

(define (speaker state depth)
  (rejection-query
   (define words (sentence-prior))
   words
   (equal? state (listener words depth))))

(define (listener words depth)
  (rejection-query
   (define state (state-prior))
   state
   (if (= depth 0)
       (words state)
       (equal? words (speaker state (- depth 1))))))

(define depth 1)

(hist (repeat 300 (lambda () (listener some depth))))