<?php
	
	namespace AppBundle\Controller;
	
	use AppBundle\Entity\Service;
	use AppBundle\Entity\User;
	use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
	use Symfony\Bundle\FrameworkBundle\Controller\Controller;
	use Symfony\Component\HttpFoundation\Request;
	use Symfony\Component\HttpFoundation\Response;
	
	class ServiceController extends Controller {
		
		/**
		 *
		 * @Route("/service/show/{id}")
		 *
		 */
		public function showAction(Request $request, $id) {
			$service = $this
				->getDoctrine()
				->getRepository('AppBundle:Service')
				->find($id);
			
			if (!$service) {
				//TODO service not found page
				throw $this->createNotFoundException(
					'No Service found for id '.$id
				);
			}
			
			if ($service->isDisabled()) {
				//TODO service disabled page
				return new Response('<p>Service with id '.$service->getId().' has been disabled.</p>');
			}
			
			if ($service->getStatus() === 'DO') {
				//TODO service already done page
				return new Response('<p>Service with id '.$service->getId().' has already been done.</p>');
			}
			
			return $this->render('service/show.html.twig', array(
				'service' => $service,
			));
		}
		
		/**
		 *
		 * @Route("/user/service/new")
		 *
		 */
		public function newAction(Request $request) {
			if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
				throw $this->createAccessDeniedException();
			}
			
			$formFactory = $this->get('form.factory');
			
			$service = new Service;
			$form = $formFactory->createNamed('new_service', 'AppBundle\Form\ServiceType', $service);
			
			$form->handleRequest($request);
			
			if ($form->isSubmitted() && $form->isValid()) {
				$user = $this->getUser();
				$service = $form->getData();
				$now = new \DateTime();
				$service
					->setDate($now)
					->setStatus('OP')
					->setUser($user);
				$em = $this->getDoctrine()->getManager();
				$em->persist($service);
				$em->flush();
				
				//TODO creation confirmation page
				return new Response('<p>Saved new Service with id '.$service->getId()."</p>\n<pre>".var_export($service, true).'</pre>');
			}
			
			return $this->render('user/service_new.html.twig', array(
				'form' => $form->createView(),
			));
		}
		
		/**
		 *
		 * @Route("/service/list")
		 *
		 */
		public function listAction() {
			$repository = $this->getDoctrine()->getRepository('AppBundle:Service');
			$needs = $repository->findAll();
			return $this->render('service/service_list.html.twig', array(
				'services' => $services,
			));
		}
		
		/**
		 *
		 * @Route("/user/service/edit/{id}")
		 *
		 */
		public function editAction(Request $request, $id) {
			if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
				throw $this->createAccessDeniedException();
			}
			$user = $this->getUser();
			
			$service = $this
				->getDoctrine()
				->getRepository('AppBundle:Service')
				->find($id);
			
			if (!$service) {
				throw $this->createNotFoundException(
					'No Service found for id '.$id
				);
			}
			
			if ($service->getUser() !== $user) {
				return new Response('<p>You are not allowed to edit the Service with id '.$service->getId().'</p>');
			}
			
			if ($service->isDisabled()) {
				//TODO service disabled page
				return new Response('<p>Service with id '.$service->getId().' has been disabled.</p>');
			}
			
			$formFactory = $this->get('form.factory');
			$form = $formFactory->createNamed('edit_service', 'AppBundle\Form\ServiceType', $service);
			$form->handleRequest($request);
			
			if ($form->isSubmitted() && $form->isValid()) {
				$service = $form->getData();
				$em = $this->getDoctrine()->getManager();
				$em->flush();
				
				//TODO edit confirmation page
				return new Response('<p>Saved modifications to Service with id '.$service->getId()."</p>\n<pre>".var_export($service, true).'</pre>');
			}
			
			return $this->render('user/service_edit.html.twig', array(
				'form' => $form->createView(),
			));
		}
		
		/**
		 *
		 * @Route("/user/service/disable/{id}")
		 *
		 */
		public function disableAction(Request $request, $id) {
			if (!$this->get('security.authorization_checker')->isGranted('IS_AUTHENTICATED_FULLY')) {
				throw $this->createAccessDeniedException();
			}
			$user = $this->getUser();
			
			$service = $this
				->getDoctrine()
				->getRepository('AppBundle:Service')
				->find($id);
			
			if (!$service) {
				throw $this->createNotFoundException(
					'No Service found for id '.$id
				);
			}
			
			if ($service->getUser() !== $user) {
				return new Response('<p>You are not allowed to edit the Service with id '.$service->getId().'</p>');
			}
			
			if ($service->isDisabled()) {
				//TODO service disabled page
				return new Response('<p>Service with id '.$service->getId().' has been disabled.</p>');
			}
			
			$service->setStatus('DI');
			
			$em = $this->getDoctrine()->getManager();
			$em->flush();
				
			//TODO service disabling confirmation page
			return new Response('<p>Service with id '.$service->getId().' has been disabled.</p>');
		}
		
	}
	
?>

